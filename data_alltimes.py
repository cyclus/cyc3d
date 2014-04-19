#!/usr/bin/env python 
import os
import simplejson as json
from argparse import ArgumentParser
from datetime import datetime
import time
from pprint import pprint

import numpy as np

from tools import diff_last, cost_val, load_kind, label_kind, MAX_WASTE, MAX_COST, \
    outter_reproccessed

CAT_LABEL = "{0}\n{1}"

def json_at_year(row, kind):
    return [{'name': CAT_LABEL.format(k, label_kind(row[k], kind)), 'size': row[k]} \
            for k in row.dtype.names[1:] if row[k] > 0]

def main_by_fc():
    parser = ArgumentParser()
    parser.add_argument('filename')
    parser.add_argument('-k', dest="kind", help="waste or cost", default="waste")
    ns = parser.parse_args()

    if not os.path.isdir('years'):
        os.makedirs('years')

    data = load_kind(ns.filename, ns.kind)
    fbase = os.path.splitext(ns.filename)[0]
    jfname_template = "years/info-{0}-{1}-{2}.json"
    for row in data:
        j = {'name': "",  # FC level
             'children': json_at_year(row, ns.kind),}
        j['scale'] = sum([c['size'] for c in j['children']]) / \
                     (MAX_COST if ns.kind == "cost" else MAX_WASTE)
        jfname = jfname_template.format(fbase, row['year'], ns.kind)
        s = json.dumps(j)
        with open(jfname, 'w') as f:
            f.write(s)

if __name__ == "__main__":
    main_by_fc()
