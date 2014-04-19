import numpy as np

MAX_COST = 28271.0
MAX_WASTE = 380835.65

def diff_last(arr):
    """Takes the difference of the last column only, inplace."""
    subtot = np.array(arr[arr.dtype.names[1]])
    for k in arr.dtype.names[2:-1]:
        subtot += arr[k]
    arr[arr.dtype.names[-1]] -= subtot

# USD per tonne
COSTS = {
    "Wet Storage": 457871.820334581,
    "Dry Storage": 245664.9606599954,
    "Interim Storage": 200*1e3,
    "Repository": 650000.0,
    #"Total Used Fuel": 245664.9606599954,
    }

def cost_val(arr):
    dt = np.dtype(arr.dtype.descr[:-1])
    brr = np.empty(len(arr), dtype=dt)
    brr['year'] = arr['year']
    for k in arr.dtype.names[1:-1]:
        brr[k] = arr[k] * COSTS[k] / 1e6
    return brr

def load_kind(filename, kind):
    data = np.recfromcsv(filename, delimiter=',', filling_values=np.nan, 
                         case_sensitive=True, deletechars='', replace_space=' ')
    if kind == "waste":
        data = data[list(data.dtype.names[:-1])]
        #diff_last(data)
    elif kind == "cost":
        pass
    else:
        raise ValueError("kind must be cost or waste")
    return data

def label_kind(val, kind):
    if kind == "waste":
        label = "{0:,}\ntonnes".format(int(val))
    elif kind == "cost":
        label = "${0:,}\nmillion".format(int(val))
    else:
        raise ValueError("kind must be cost or waste")
    return label

def outter_reproccessed(parent):
    kids = {"name": "", "children": []}
    for i in range(len(parent)-1, -1, -1):
        if parent[i]['name'].startswith("Reprocessed"):
            continue
        kids['children'].append(parent[i])
        del parent[i]
    parent.append(kids)

