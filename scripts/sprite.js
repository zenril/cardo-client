let SVGSpriter = require("svg-sprite");
let xmlserializer = require("xmlserializer");
let path = require("path");
let mkdirp = require("mkdirp");
let glob = require("glob");
let fs = require("fs");
let DOMParser = require("xmldom").DOMParser;

const defs = new DOMParser().parseFromString("<defs></defs>");
let count = 0;

const config = {
  from: "src/assets/**/*.svg",
  dest: "src/assets",
  mode: {
    symbol: {
      dest: ".",
      sprite: "sprites",
      inline: true,
    },
  },
  shape: {
    transform: [gradientsExtraction, "svgo"],
    id: {
      separator: "-",
      generateParts: (name) => {
        let parts = name.split(/-|\/|\\/);
        let value = parts[parts.length - 1].replace(/\..+$/, "");
        let parent = parts[parts.length - 2];
        let iconName = `${value}`.toLowerCase();
        return {
          parts,
          value,
          parent,
          iconName,
        };
      },
      generator: function (name) {
        let { iconName } = this.generateParts(name);
        return iconName;
      },
    },
  },
  svg: {
    transform: [
      /**
       * Adds defs tag at the top of svg with all extracted gradients.
       * @param {string} svg
       * @return {string} svg
       */
      function (svg) {
        return svg.replace(
          "<symbol ",
          xmlserializer.serializeToString(defs) + "<symbol "
        );
      },
    ],
  },
};

/**
 * Extracts gradient from the sprite and replaces their ids to prevent duplicates.
 * @param {SVGShape} shape
 * @param {SVGSpriter} spriter
 * @param {Function} callback
 */
function gradientsExtraction(shape, spriter, callback) {
  const idsToReplace = [].concat(
    extractGradients(shape, "linearGradient"),
    extractGradients(shape, "radialGradient")
  );

  shape.setSVG(updateUrls(shape.getSVG(), idsToReplace));

  callback(null);
}

/**
 * Extracts specific gradient defined by tag from given shape.
 * @param {SVGShape} shape
 * @param {string} tag
 * @return {Array}
 */
function extractGradients(shape, tag) {
  const idsToReplace = [];

  const gradients = shape.dom.getElementsByTagName(tag);
  while (gradients.length > 0) {
    // Add gradient to defs block
    defs.documentElement.appendChild(gradients[0]);

    // Give gradient new ID
    const id = gradients[0].getAttribute("id");
    const newId = "g" + ++count;
    gradients[0].setAttribute("id", newId);

    idsToReplace.push([id, newId]);
  }

  return idsToReplace;
}

/**
 * Updates urls in given SVG from array of [oldId, newId].
 * @param {string} svg
 * @param {Array} idsToReplace
 * @return {string}
 */
function updateUrls(svg, idsToReplace) {
  for (let i = 0; i < idsToReplace.length; i++) {
    const str = "url(#" + idsToReplace[i][0] + ")";
    svg = svg.replace(
      new RegExp(regexEscape(str), "g"),
      "url(#" + idsToReplace[i][1] + ")"
    );
  }

  return svg;
}

/**
 * Escape regex characters in given string
 * @param {string} str
 * @return {string}
 */
function regexEscape(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

let spriter = new SVGSpriter(config);

glob(config.from, (er, files) => {
  let json = {
    sprites: [],
    suits: [],
  };

  files.forEach((file) => {
    let { parent, iconName } = config.shape.id.generateParts(
      path.relative(__dirname, file)
    );

    json[parent == "suits" ? "suits" : "sprites"].push(iconName);
    spriter.add(
      path.resolve(file),
      path.relative(__dirname, file),
      fs.readFileSync(path.resolve(file), { encoding: "utf-8" })
    );
  });

  spriter.compile((error, result, cssData) => {
    for (var mode in result) {
      for (var type in result[mode]) {
        mkdirp.sync(path.dirname(result[mode][type].path));
        fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
        if (type == "sprite" && (mode == "symbol" || mode == "defs")) {
          fs.writeFileSync(
            `${path.dirname(result[mode][type].path)}/sprites.json`,
            JSON.stringify(json)
          );
        }
      }
    }
  });
});
