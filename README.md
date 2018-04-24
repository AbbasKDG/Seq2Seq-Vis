# Seq2Seq-Vis

### A visual debugging tool for Sequence-to-Sequence models 
*by IBM Research AI and Harvard SEAS  -- more info [seq2seq-vis.io](http://seq2seq-vis.io)

![Seq2Seq-Vis](docs/pics/s2s_teaser.png)











## Install with `conda`

We require using [miniconda](https://conda.io/docs/user-guide/install/index.html) to create a virtual environment and install all dependencies via scripts. 
Seq2Seq-Vis currently works with a special version of OpenNMT-py modified version by [Sebastian Gehrmann](https://github.com/sebastianGehrmann/OpenNMT-py/tree/states_in_translation). We provide a script to install this special branch. 

### 1 - Install dependencies (server and client) and create virtual environment



```bash
git clone https://github.com/HendrikStrobelt/Seq2Seq-Vis.git
cd Seq2Seq-Vis
```

and run in `/Seq2Seq-Vis`:

```bash
source setup_cpu.sh
```

### 2 - Install custom OpenNMT-py version

```bash
cd ..
source Seq2Seq-Vis/setup_onmt_custom.sh
```

### 3 - Download some example data
Here we provide some example data for a character based dataset which converts date strings (e.g. "March 03, 1999" , "03/03/99") into a base form "mm-dd-yyyy".  [Download here ~130MB]() and unzip it in `/Seq2Seq-Vis`

```bash
unzip fakedate.zip
```

## Run the system

```bash
python3 server.py --dir 0316-fakedates/
```
go here: [http://localhost:8080/client/index.html?in=M a r c h _ 0 3 , 1  9 9 9](http://localhost:8080/client/index.html?in=M%20a%20r%20c%20h%20_%200%203%20,%20%201%209%209%209)

You should see:

<img src="docs/pics/s2s_dates_01.png" width="400">

Enjoy exploring !





## Run own models

### 1 - Prepare your data
to be done.

### 2 - Create a `s2s.yaml` file to describe project

```yaml
# -- minimal config 
model: date_acc_100.00_ppl_1.00_e7.pt  # model file
dicts:
 src: src.dict  		# source dictionary file
 tgt: tgt.dict  		# target dictionary file
embeddings: embs.h5  	# word embeddings for src and tgt
train: train.h5			# training data 

# -- OPTIONAL: FAISS indices for Neighborhoods
indexType: faiss		# index type should be 'faiss' (or 'annoy')
indices:
 decoder: decoder.faiss		# index for decoder states
 encoder: encoder.faiss		# index for encoder states

# -- OPTIONAL: model for linear projection
project_model: linear_projection.pkl		# pickl-ed scikit-learn model
```

### 3 - Command Line Parameters

```
usage: server.py [-h] [--nodebug NODEBUG] [--port PORT]
                 [-dir DIR]

optional arguments:
  --nodebug 	TRUE if not in debug mode
  --port 		port to run system (default: 8080)
  --dir  		directory with s2s.yaml file
```

# Cite us

```
BIBTEX to arxive
```

# Contributors

- Hendrik Strobelt (IBM Research & MIT-IBM Watson AI Lab)
- Sebastian Gehrmann (Harvard NLP)
- Alexander M. Rush  (Harvard NLP)

- Michael Behrisch (Harvard VCG), Adam Perer (IBM Research), Hanspeter Pfister (Harvard VCG)

# License

Seq2Seq-Vis is licensed under Apache 2 license.
