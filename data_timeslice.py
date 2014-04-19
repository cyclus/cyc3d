#!/usr/bin/env python 
from __future__ import print_function
import os
#import json
import simplejson as json
from argparse import ArgumentParser
from datetime import datetime
import time
from pprint import pprint

import numpy as np

from tools import diff_last, cost_val, load_kind, label_kind, MAX_COST, MAX_WASTE, \
    outter_reproccessed

def json_at_year(filename, year, kind):
    data = load_kind(filename, kind)
    data = np.array(data[data['year'] == year])
    return [{'name': k, 'size': data[k][0]} for k in data.dtype.names[1:] \
            if data[k][0] > 0]

def main_by_year():
    parser = ArgumentParser()
    parser.add_argument('year', type=int)
    parser.add_argument('filenames', nargs="+")
    parser.add_argument('-k', dest="kind", help="waste or cost", default="waste")
    ns = parser.parse_args()
    j = {'name': "Year {0}".format(ns.year), 'children': []}
    for i, filename in enumerate(ns.filenames, 1):
        j['children'].append({'name': 'Fuel Cycle {0}'.format(i),
                              'children': json_at_year(filename, ns.year, ns.kind),
                              })
    jfname = "year{0}-{1}.json".format(ns.year, ns.kind)
    s = json.dumps(j)
    with open(jfname, 'w') as f:
        f.write(s)

CAT_LABEL = "year {0}\n{1}"

def json_at_category(data, category, years, kind):
    j = []
    for row in data:
        if row['year'] not in years:
            continue
        label = CAT_LABEL.format(row['year'], label_kind(row[category], kind))
        j.append({'name': label, 'size': row[category]})
    return j

def main_by_fc_cat_year():
    parser = ArgumentParser()
    parser.add_argument('filename')
    parser.add_argument('years', nargs='+', type=int)
    parser.add_argument('-k', dest="kind", help="waste or cost", default="waste")
    ns = parser.parse_args()
    years = set(ns.years)
    data = load_kind(ns.filename, ns.kind)
    j = {'name': "", 'children': []}  # FC level
    for category in data.dtype.names[1:]:
        j['children'].append({'name': category,
                              'children': json_at_category(data, category, 
                                                           years, ns.kind),
                              })
    jfname = "info-{0}-{1}-{2}.json".format(os.path.splitext(ns.filename)[0], 
                                            "_".join(map(str, ns.years)), ns.kind)
    s = json.dumps(j)
    with open(jfname, 'w') as f:
        f.write(s)

YEAR_CAT_LABEL = "{0}\n{1}"

def json_at_year_cat(data, year, kind):
    #data = np.array(data[data['year'] == year])
    d = data[data['year'] == year]
    return [{'name': YEAR_CAT_LABEL.format(k, label_kind(d[k][0], kind)), 
             'size': d[k][0] / (MAX_COST if kind == "cost" else MAX_WASTE)} \
            for k in d.dtype.names[1:] if d[k][0] > 0]

def main_by_fc_year_cat():
    parser = ArgumentParser()
    parser.add_argument('filename')
    parser.add_argument('years', nargs='+', type=int)
    parser.add_argument('-k', dest="kind", help="waste or cost", default="waste")
    ns = parser.parse_args()
    years = set(ns.years)
    data = load_kind(ns.filename, ns.kind)
    j = {'name': "", 'children': [], 'scale': 0.0}  # FC level
    for year in years:
        j['children'].append({'name': "year {0}".format(year),
                              'children': json_at_year_cat(data, year, ns.kind),})
        with open('/dev/null', 'a') as f:
            # prevents weird numpy segfault
            print(data, file=f)
        j['scale'] = max(j['scale'], sum([c['size'] for c in j['children'][-1]['children']]))
    jfname = "info-{0}-{1}-{2}.json".format(os.path.splitext(ns.filename)[0], 
                                            "_".join(map(str, ns.years)), ns.kind)
    s = json.dumps(j)
    with open(jfname, 'w') as f:
        f.write(s)

if __name__ == "__main__":
    main_by_fc_year_cat()
