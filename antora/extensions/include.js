'use strict'

module.exports.register = (pipeline, { playbook, config }) => {
    var fs = pipeline.require("fs");
    // console.log(`Antora is building the ${JSON.stringify(playbook, null, 2)}.`)
    // console.log(`Antora config ${JSON.stringify(config, null, 2)}.`)
    // log(pipeline);

    var contentAggregate = [];

    pipeline.on('contentAggregated',  args => {
        for (const c of args.contentAggregate) {
            const copy = new Object();
            Object.assign(copy, c);
            contentAggregate.push(copy);
        }
    });

    pipeline
        .on('contentClassified', ({ contentCatalog }) => {
            const name = 'java-project'
            const version = '2.6'

            console.log(JSON.stringify(contentAggregate, no_data, 2));
            const filesToAdd = contentAggregate[0].files.filter(f => f.src.origin.url.includes("examples"));
            for (const f of filesToAdd) {
                console.log(JSON.stringify(f, no_data, 2));
                const src = {
                    component: name,
                    version,
                    module: 'ROOT',
                    family: 'example',
                    relative: f.src.path
                }
                Object.assign(f.src, src);
                contentCatalog.addFile(f);
            }
        })
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