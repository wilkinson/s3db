//- JavaScript source code

//- s3db.js ~~
//
//  I'm not totally sure what this code does or how it is used, but because I
//  had trouble reading it, I uncommented the `querycode` function definition
//  and then ran this file as a program using the D8 developer shell:
//
//      $ d8 s3db.js > output.js; mv output.js s3db.js
//
//
//      querycore = function (obj) {
//          print('querycore(' + JSON.stringify(obj, undefined, 4) + ');');
//          return;
//      };
//
//  It took a lot longer to write this explanation than to clean things up, but
//  I am documenting it because I may be applying the technique to other files.
//
//                                                      ~~ (c) SRW, 26 Oct 2012

querycore({
    "name": "s3db",
    "entities": [
        "deployment",
        "user",
        "project",
        "collection",
        "rule",
        "item",
        "statement"
    ],
    "entity_ids": {
        "D": "deployment_id",
        "U": "user_id",
        "P": "project_id",
        "C": "collection_id",
        "R": "rule_id",
        "I": "item_id",
        "S": "statement_id"
    },
    "relationships": {
        "DP": {
            "domain": "deployment",
            "range": "project"
        },
        "PC": {
            "domain": "project",
            "range": "collection"
        },
        "PR": {
            "domain": "project",
            "range": "rule"
        },
        "CI": {
            "domain": "collection",
            "range": "item"
        },
        "Rsubject": {
            "domain": "collection",
            "range": "rule"
        },
        "Robject": {
            "domain": "collection",
            "range": "rule"
        },
        "Rpredicate": {
            "domain": "item",
            "range": "rule"
        },
        "Ssubject": {
            "domain": "item",
            "range": "statement"
        },
        "Sobject": {
            "domain": "item",
            "range": "statement"
        },
        "Spredicate": {
            "domain": "rule",
            "range": "statement"
        },
        "DU": {
            "domain": "user",
            "range": "user"
        }
    },
    "actions": [
        "select",
        "insert",
        "update",
        "delete"
    ],
    "entitySymbols": {
        "D": "deployment",
        "U": "user",
        "P": "project",
        "C": "collection",
        "R": "rule",
        "I": "item",
        "S": "statement"
    },
    "globalAttributes": [
        "id",
        "label",
        "description",
        "created",
        "creator"
    ],
    "specificAttributes": {
        "deployment": [],
        "user": [
            "username",
            "email"
        ],
        "project": [],
        "collection": [
            "project_id"
        ],
        "rule": [
            "project_id",
            "subject_id",
            "verb_id",
            "object_id"
        ],
        "item": [
            "collection_id"
        ],
        "statement": [
            "item_id",
            "rule_id",
            "value"
        ]
    }
});

//- vim:set syntax=javascript:
