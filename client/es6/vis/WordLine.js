class WordLine extends VComponent {

    static get events() {
        return {
            wordHovered: 'wordline_word_hovered',
            wordSelected: 'wordline_word_selected',

        }
    }

    static get BoxType() {
        return {
            fixed: 1,
            flow: 2,
        }
    }

    // noinspection JSUnusedGlobalSymbols
    static get defaultOptions() {
        return {
            text_measurer: null,
            box_height: 23,
            box_width: 100, // ignored when flow !!
            box_type: WordLine.BoxType.flow,
            data_access: (d) => [d.encoder], // [list of [lists of words]]
            css_class_main: 'inWord',
            css_class_add: '',
            x_offset: 3
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @inheritDoc
     * @override
     * @return {Array}
     */
    static get layout() {
        return []
    }

    // --- default constructor ---


    _init() {
        this.options.text_measurer = this.options.text_measurer
          || new SVGMeasurements(this.parent, 'measureWord');

        this._positions = [];
    }


    _wrangle(data) {
        const op = this.options;

        const renderData = {
            rows: []
        };
        this._states.selectedWord = null;
        // calculate distances


        const toWordFlow = token => ({
            text: token,
            width: Math.max(op.text_measurer.textLength(token), 20)
        });
        const toWordFixed = token => ({
            text: token,
            width: op.box_width - 10,
            realWidth: op.text_measurer.textLength(token)
        });

        if (op.box_type === WordLine.BoxType.fixed) {
            renderData.rows = op.data_access(data).map(row => row.map(w => toWordFixed(w.token)))
        } else {
            renderData.rows = op.data_access(data).map(row => row.map(w => toWordFlow(w.token)))
        }


        const allLengths = [];
        const calcPos = words => {
            let inc = 0;
            const rr = [...words.map(w => {
                const res = inc;
                inc += +w.width + 10;
                return res
            })];
            allLengths.push(inc);
            return rr;
        };

        this._positions = renderData.rows.map(row => calcPos(row));


        // noinspection JSUnresolvedFunction
        this.parent.attrs({
            width: d3.max(allLengths) + 6,
            height: renderData.rows.length * (op.box_height) - 2
        });
        // todo: update SVG (parent) size

        return renderData;

    }

    actionWordHovered({d, i, hovered}) {
        this.eventHandler.trigger(
          WordLine.events.wordHovered,
          {
              hovered,
              caller: this,
              word: d,
              index: i,
              css_class_main: this.options.css_class_main
          })
    }

    // noinspection JSUnusedGlobalSymbols
    _render(renderData) {
        const op = this.options;
        const that = this;

        // [rows of [words of {wordRect, wordText}]]

        let rows = this.base.selectAll('.word_row').data(renderData.rows);
        rows.exit().remove();
        rows = rows.enter()
          .append('g').attr('class', 'word_row')
          .merge(rows)
          .attr('transform', (_, i) => `translate(${op.x_offset},${(i) * (op.box_height)})`);

        let words = rows.selectAll(`.${op.css_class_main}`)
          .data((row, rowID) => row.map(word => ({row: rowID, word})));
        words.exit().remove();
        words = words.enter()
          .append('g').attr('class', `${op.css_class_main} ${op.css_class_add}`)
          .merge(words)
          .attrs({'transform': (w, i) => `translate(${this.positions[w.row][i]},0)`,});


        const wordRects = words.selectAll('rect').data(d => [d]);
        wordRects.enter().append('rect')
          .attrs({
              x: -3,
              y: 0,
              height: op.box_height - 2,
              rx: 3,
              ry: 3
          })
          .merge(wordRects)
          .attr('width', d => d.word.width + 6)
          .on('mouseenter', (d, i) => {
              this.actionWordHovered({d, i, hovered: true})
              // this.layers.main.selectAll(`.${hoverPrefix + i}`).raise().classed('highlight', true);
          })
          .on('mouseout', (d, i) => {
              this.actionWordHovered({d, i, hovered: false})
              // this.layers.main.selectAll(`.${hoverPrefix + i}`).classed('highlight', null);
          })
          .on('click', (d, i) => this.actionWordClicked({d, i}))

        const wordText = words.selectAll('text').data(d => [d]);
        wordText.enter()
          .append('text')
          // .attr('y', 11)
          .merge(wordText)
          // .attr('x', d => d.word.width * .5)
          .attr('transform', d => {
              const w = d.word;
              if (op.box_type === WordLine.BoxType.fixed
                && w.width < w.realWidth && w.realWidth > 0)
                  return `translate(${d.word.width * .5},11)scale(${w.width / w.realWidth},1)`
              else
                  return `translate(${d.word.width * .5},11)`
          })
          .text(d => d.word.text);


    }


    get positions() {
        return this._positions;
    }

    get rows() {
        return this.renderData.rows;
    }


    actionWordClicked({d, i}) {
        let selected = !(this._states.selectedWord === i);
        this._states.selectedWord = selected ? i : null;

        this.eventHandler.trigger(
          WordLine.events.wordSelected,
          {
              selected,
              caller: this,
              word: d,
              index: i
          })

    }
}