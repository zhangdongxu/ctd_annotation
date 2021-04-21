import json

dataset = json.loads(open('test.json').read())[:100]

new_dataset = {"apple": {"browse_history": 0, "data": []}, "banana": {"browse_history": 0, "data":[]}}
for doc in dataset:
    entity_dict = {}
    for ent in doc['entity']:
        start, end, mention, etype, eid = ent["start"], ent["end"], ent["mention"], ent["type"], ent["id"]
        if eid != '-':
            if eid not in entity_dict: entity_dict[eid] = []
            entity_dict[eid].append([start, end, mention, etype])
    new_doc = {}
    new_doc['pid'] = doc["docid"] 
    new_doc["entities"] = entity_dict
    new_doc["labels"] = [[rel["subj"], rel["obj"], rel['type']] for rel in doc["relation"]]
    if new_doc["labels"] == []:
        new_doc["labels"] = [["", "", ""]]
    new_doc["title"] = doc["title"]
    new_doc["abstract"] = doc["abstract"]
    new_doc["complete"] = False
    new_dataset["apple"]["data"].append(new_doc)
    new_dataset["banana"]["data"].append(new_doc)
open("data.json", "w").write(json.dumps(new_dataset, indent=True))
