'use strict'

module.exports.register = (pipeline, { playbook, config }) => {
    var contentAggregate = [];

    pipeline.on('contentAggregated',  args => {
        for (const c of args.contentAggregate) {
            contentAggregate.push(Object.assign(new Object(), c));
        }
    });

    pipeline.on('contentClassified', ({ contentCatalog }) => {
        for (const content of contentAggregate) {
            const name = content.name;
            const version = content.version;
            for (const [mapping_name, mapping_value] of Object.entries(config.contentCatalog)) {
                const filesToAdd = content.files
                    .filter(f => testAnyRegex(mapping_value.gitUrlPatterns, f.src.origin.url));
                for (const f of filesToAdd) {
                    const src = {
                        component: name,
                        version,
                        module: mapping_value.module,
                        family: mapping_value.family,
                        relative: f.src.path
                    }
                    Object.assign(f.src, src);
                    contentCatalog.addFile(f);
                }
            }
        }
        contentAggregate = null;
    });
}

function testAnyRegex(regexes, str) {
    if (!regexes) {
        return true;
    }
    for (const r of regexes) {
        if (new RegExp(r).test(str)) {
            return true;
        }
    }
    return false;
}

function log(pipeline) {
    pipeline.on('playbookBuilt',  ({ playbook }) => {
        console.log(`playbookBuilt ${JSON.stringify(playbook, null, 2)}.`)
    });
    pipeline.on('beforeProcess',  args => {
        console.log(`beforeProcess ${JSON.stringify(args, null, 2)}.`)
    });
    pipeline.on('contentAggregated',  args => {
        const json = JSON.stringify(args, no_data, 2);
        console.log(`contentAggregated ${json}.`)
    });
    pipeline.on('uiLoaded',  args => {
        const json = JSON.stringify(args, no_data, 2);
        console.log(`uiLoaded ${json}.`)
    });
    pipeline.on('contentClassified',  args => {
        const json = JSON.stringify(args, no_data, 2);
        console.log(`contentClassified ${json}.`)
    });
}

function no_data(key, value) {
    if (key == "data") {
        return value ? "__data__" : value;
    }
    return value;
}