//- JavaScript source code

//- s3ql_translator.js ~~
//                                                  ~~ last updated 26 Oct 2012

if (String.prototype.hasOwnProperty('trim') === false) {
    String.prototype.trim = function () {
        'use strict';
     // This function is not generally necessary in the "modern day" of 2012.
        return this.replace(/^\s*/, '').replace(/\s*$/, '');
    };
}

var S3QLtranslator;

S3QLtranslator = function (query, core) {
 // This function needs documentation.
    /*jslint browser: true, devel: true, indent: 4, maxlen: 80, regexp: true */
    /*global $: false, uid_resolve: false */
    var actions, attr, attrValue, i, ind, letterSymbol, op, p, params, pi,
        s3ql_params, s3ql_query, search, symbols, t, target, targetAndParams,
        template, uid_info, value;
    if ((core instanceof Object) === false) {
        core = {
            'name': 's3db',
            'entities': [
                'deployment',
                'user',
                'project',
                'collection',
                'rule',
                'item',
                'statement'
            ],
            'entity_ids': {
                'D': 'deployment_id',
                'U': 'user_id',
                'P': 'project_id',
                'C': 'collection_id',
                'R': 'rule_id',
                'I': 'item_id',
                'S': 'statement_id'
            },
            'relationships': {
                'DP': {
                    'domain': 'deployment',
                    'range': 'project'
                },
                'PC': {
                    'domain': 'project',
                    'range': 'collection'
                },
                'PR': {
                    'domain': 'project',
                    'range': 'rule'
                },
                'CI': {
                    'domain': 'collection',
                    'range': 'item'
                },
                'Rsubject': {
                    'domain': 'collection',
                    'range': 'rule'
                },
                'Robject': {
                    'domain': 'collection',
                    'range': 'rule'
                },
                'Rpredicate': {
                    'domain': 'item',
                    'range': 'rule'
                },
                'Ssubject': {
                    'domain': 'item',
                    'range': 'statement'
                },
                'Sobject': {
                    'domain': 'item',
                    'range': 'statement'
                },
                'Spredicate': {
                    'domain': 'rule',
                    'range': 'statement'
                },
                'DU': {
                    'domain': 'user',
                    'range': 'user'
                }
            },
            'actions': [
                'select',
                'insert',
                'update',
                'delete'
            ],
            'entitySymbols': {
                'D': 'deployment',
                'U': 'user',
                'P': 'project',
                'C': 'collection',
                'R': 'rule',
                'I': 'item',
                'S': 'statement'
            },
            'globalAttributes': [
                'id',
                'label',
                'description',
                'created',
                'creator'
            ],
            'specificAttributes': {
                'deployment': [],
                'user': [
                    'username',
                    'email'
                ],
                'project': [],
                'collection': [
                    'project_id'
                ],
                'rule': [
                    'project_id',
                    'subject_id',
                    'verb_id',
                    'object_id'
                ],
                'item': [
                    'collection_id'
                ],
                'statement': [
                    'item_id',
                    'rule_id',
                    'value'
                ]
            }
        };
    }
 // Start off by reading everything that comes before the first `|`. Detect any
 // operation specification; separate components so that each can be trimmed.
    actions = '';
    $.each(core.actions, function (index, value) {
     // This function previously contained a really confusing `if` statement;
     // hopefully I have transformed it equivalently, but I'm noting it here.
        if (index !== 0) {
            actions += '|';
        }
        actions += value;
        return;
    });
    op = query.trim().match(actions);
    if (op) {
        op = op[0].trim();
        targetAndParams = query.replace(op, '').trim().match(/\((.*)\)/);
        if (!targetAndParams) {
            console.log('invalid query - ' +
                'parameters are required to be inside parenthesis');
            return false;
        }
        targetAndParams = targetAndParams[1];
    } else {
        op = 'select';
        targetAndParams = query.trim();
    }
    symbols = '';
    ind = 0;
    $.each(core.entitySymbols, function (index, value) {
        //if(ind!==0) symbols += '|';
        symbols += index;
        ind += 1;
    });
    target = targetAndParams.trim().match('^[' + symbols + ']');
    if (!target) {
        console.log('invalid query - one of ' + symbols +
            ' is required to initialize the query');
        return false;
    }
    target = target[0];
    t = targetAndParams.trim().match('[^|]*|');
    template = t[0].split(',');
    search = '';
    if (template) {
        for (i = 0; i < template.length; i += 1) {
            if ((template[i] !== '') && (template[i].trim() !== target)) {
                search += template[i].trim().replace(target + '.', '');
                if (i !== (template.length - 1)) {
                    search += ',';
                }
            }
        }
    }
    params = targetAndParams.trim().match(/\|(.*)/);
 // Detect if there is more than 1 paramenter
    s3ql_params = '';
    if (params) {
        s3ql_params += '<where>';
        params = params[1].trim();
        p = params.split(',');
        for (i = 0; i < p.length; i += 1) {
            pi = p[i].trim();
            attrValue = pi.match(/(.*)=(.*)/);
            if (attrValue) {
                attr = attrValue[1].trim();
                value = attrValue[2].trim();
                if (attr && value) {
                    if (core.entitySymbols[attr]) {
                        attr = core.entity_ids[attr];
                    }
                }
            } else if (pi.match('[' + symbols + '](.*)')) {
                letterSymbol = pi.match('(' + symbols + ')([0-9]+| (.+))');
                if ((core instanceof Object) && (core.name === 's3db')) {
                    uid_info = uid_resolve(pi);
                } else {
                    uid_info = {
                        'letter': letterSymbol[1],
                        's3_id': letterSymbol[2]
                    };
                }
                attr = core.entity_ids[uid_info.letter];
                value = uid_info.origin;
            }
            s3ql_params += '<' + attr + '>' + value + '</' + attr + '>';
        }
        s3ql_params += '</where>';
    }
 // Now build the s3ql query.
    if (op === 'select') {
        if ((typeof search !== 'string') || (search === '')) {
            search = '*';
        }
        s3ql_query += '<S3QL><select>' + search + '</select><from>' +
            core.entitySymbols[target] + '</from>';
    } else {
        s3ql_query += '<S3QL><' + op + '>' +
            core.entitySymbols[target] + '</' + op + '>';
    }
    s3ql_query += s3ql_params;
    s3ql_query += '</S3QL>';
    return s3ql_query;
};

//- vim:set syntax=javascript:
