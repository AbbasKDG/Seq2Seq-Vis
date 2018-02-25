import {Networking} from "../etc/Networking";
import {LooseObject} from "../etc/LocalTypes";
import {WordLineData} from "../vis/WordLine";
import {AttentionVisData} from "../vis/AttentionVis";

export class S2SApi {


    static translate({input}) {
        const request = Networking.ajax_request('/api/translate');
        const payload = new Map([['in', input],
            ['neighbors', 'decoder,encoder,context']]);

        return request.get(payload)
    }

    static translate_compare({input, compare}) {
        const request = Networking.ajax_request('/api/translate_compare');
        const payload = new Map([
            ['in', input],
            ['compare', compare],
            ['neighbors', 'decoder,encoder,context']]);

        return request.get(payload)
    }

    static closeWords({input, limit = 50, loc = 'src'}) {
        const request = Networking.ajax_request('/api/close_words');
        const payload = new Map([
            ['in', input],
            ['loc', loc],
            ['limit', limit]]);

        return request
            .get(payload)
    }

    static compareTranslation({pivot, compare}) {
        const request = Networking.ajax_request('/api/compare_translation');
        const payload = new Map([
            ['in', pivot],
            ['compare', compare]]);

        return request
            .get(payload)
    }


}


export class Translation {

    private readonly _result: {
        attn: number[][][],
        attnFiltered: number[][][],
        scores: number[],
        decoder: {
            neighbors: number[][],
            neighbor_context: number[][],
            state: number[],
            token: string
        }[][],
        encoder: {
            neighbors: number[][],
            state: number[],
            token: string
        }[],
        [key: string]: any
    } = null;

    public _current: LooseObject;

    constructor(result) {
        this._result = result;
    }


    public filterAttention(threshold = .75) {

        if (this._result.attn.length > 0) {

            const res = [];

            for (const topSentence of this._result.attn) {
                const newSentence = [];
                for (const row of topSentence) {
                    const sortedValues = row.map((v, i) => [v, i])
                        .sort((a, b) => b[0] - a[0]);
                    const newRow = new Array(row.length).fill(0);
                    let acc = 0;
                    let index = 0;
                    while (acc < threshold && index < row.length) {
                        const v = sortedValues[index][0];
                        newRow[sortedValues[index][1]] = v;
                        acc += v;
                        index++;
                    }
                    newSentence.push(newRow)
                }
                res.push(newSentence)
            }
            this._result.attnFiltered = res;
            return true;

        } else return false;

    }


    get encoderWords(): string[] {
        return this._result.encoder.map(w => w.token);
    }

    get inputSentence(): string {
        return this.encoderWords.join(' ')
    }

    get decoderWords(): string[][] {
        return this._result.decoder.map(
            deco => deco.map(
                w => w.token))
    }


    get result() {
        return this._result;
    }

    get attn() {
        return this._result.attn;
    }

    get attnFiltered() {
        return this._result.attnFiltered;
    }

    get encoder() {
        return this._result.encoder;
    }

    get encoderNeighbors() {
        return this._result.encoder.map(d => d.neighbors)
    }

    get decoder() {
        return this._result.decoder;
    }

    get decoderNeighbors() {
        return this._result.decoder.map(dec =>
            dec.map(d => d.neighbors))
    }

    get contextNeighbors() {
        return this._result.decoder.map(dec =>
            dec.map(d => d.neighbor_context))
    }

    get scores() {
        return this._result.scores;
    }

}