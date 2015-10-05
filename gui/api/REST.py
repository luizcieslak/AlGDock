from flask import Flask, jsonify

import os
import json
from cross_domain import *

app = Flask(__name__)

try:
    TARGET = os.environ['TARGET']
    AlGDock = os.environ['AlGDock']
except Exception:
    print 'export TARGET=<path to data>'
    exit(1)

import sys
sys.path.insert(0, AlGDock)
from BindingPMF_arguments import *

@app.route('/api/v1.0/proteins', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_protein_names():
    proteins = os.walk(TARGET).next()[1]
    protein_lst = [{"filename": protein} for protein in sorted(proteins) if protein != "scripts"]
    return jsonify({"files": protein_lst})

@app.route('/api/v1.0/ligands/<protein>', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_ligand_names(protein):
    ligands = os.walk(os.path.join(TARGET, protein, "ligand")).next()[2]
    ligand_lst = [{"filename": ligand} for ligand in sorted(ligands) if ".ism" in ligand]
    return jsonify({"files": ligand_lst})

@app.route('/api/v1.0/ligandSelection/<protein>/<library>', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_ligand_selections(protein, library):
    trimmed_library = library.split(".ism")[0] + ".A__"
    try:
        ligand_selections = sorted(os.walk(os.path.join(TARGET, protein, "AlGDock/cool", trimmed_library)).next()[1])
    except Exception:
        ligand_selections = None
    return jsonify({"ligandSelections": ligand_selections})

@app.route('/api/v1.0/ligandLine/<protein>/<library>/<lineNumber>', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_ligand_line(protein, library, lineNumber):
    try:
        path = os.path.join(TARGET, protein, "ligand", library)
        library_f = open(path, 'r')
        for i, line in enumerate(library_f):
            if i == int(lineNumber) - 1:
                return line.split()[0]
        library_f.close()
    except Exception:
        return None

@app.route('/api/v1.0/addToLibrary/<protein>/', methods=['POST', 'OPTIONS'])
@crossdomain(origin='*')
def add_to_library(protein):
    fileJson = request.get_json()
    libraryName = fileJson["libraryName"]
    smiles = fileJson["smiles"]
    library_f = open(os.path.join(TARGET, protein, "ligand", libraryName), 'a')
    library_f.write(smiles)
    library_f.write("\n")
    library_f.close()    
    return "Added ligand to library."

@app.route('/api/v1.0/protocols', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_protocols():
    choices = arguments['protocol']['choices']
    choice_lst = [{"choice": choice} for choice in choices]
    return jsonify({"protocol": choice_lst})

@app.route('/api/v1.0/samplers', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_samplers():
    choices = arguments['sampler']['choices']
    choice_lst = [{"choice": choice} for choice in choices]
    return jsonify({"sampler": choice_lst})

@app.route('/api/v1.0/sites', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_sites():
    choices = arguments['site']['choices']
    choice_lst = [{"choice": choice} for choice in choices]
    return jsonify({"site": choice_lst})

@app.route('/api/v1.0/phases', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_phases():
    choices = allowed_phases
    choice_lst = [{"choice": choice} for choice in choices]
    return jsonify({"phase": choice_lst})

@app.route('/api/v1.0/runtypes', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def get_runtype():
    choices = arguments['run_type']['choices']
    choice_lst = [{"choice": choice} for choice in choices]
    return jsonify({"runtype": choice_lst})

@app.route('/api/v1.0/run/<protein>/<ligand>/<protocol>/<runtype>/<cthermspeed>/<dthermspeed>/<sampler>/<mcmc>/<seedperstate>/<stepsperseed>/<sweepspercycle>/<attemptspersweep>/<stepspersweep>/<crepxcycles>/<drepxcycles>/<site>/<sxcenter>/<sycenter>/<szcenter>/<sradius>/<sdensity>/<phase>/<cores>/<rmsd>/', methods=['GET', 'OPTIONS'])
@crossdomain(origin='*')
def run(protein, ligand, protocol, runtype, cthermspeed, dthermspeed, sampler, mcmc, seedperstate, stepsperseed, sweepspercycle, attemptspersweep, stepspersweep, crepxcycles, drepxcycles, site, sxcenter, sycenter, szcenter, sradius, sdensity, phase, cores, rmsd):
    return "Protein selected: %s; Ligand selected: %s; Protocol selected: %s; Run Type selected: %s; cthermspeed selected: %s; dthermspeed selected: %s; sampler selected: %s; mcmc selected: %s; seedperstate selected: %s; stepsperseed selected: %s; sweepspercycle selected: %s; attemptspersweep selected: %s; stepspersweep selected: %s; crepxcycles selected: %s; drepxcycles selected: %s; site selected: %s; Site center: X: %s Y: %s Z: %s; sradius selected: %s; sdensity selected: %s; phase selected: %s; cores selected: %s; rmsd selected: %s;)" % (protein, ligand, protocol, runtype, cthermspeed, dthermspeed, sampler, mcmc, seedperstate, stepsperseed, sweepspercycle, attemptspersweep, stepspersweep, crepxcycles, drepxcycles, site, sxcenter, sycenter, szcenter, sradius, sdensity, phase, cores, rmsd)

if __name__ == '__main__':
    app.run(debug=True)
