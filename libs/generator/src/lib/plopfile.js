import fs from 'fs';
import path from 'path';

export default function (plop) {
  const supportedMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    // 'PATCH'
  ];

  plop.setGenerator('generateMock', {
    description: 'Generate a Mezzo route',
    prompts: [
      {
        type: 'input',
        name: 'basePath',
        message: 'What is your path to your mocked directory',
      },
      {
        type: 'input',
        name: 'endpoint',
        message: 'What is the route path',
        filter: (value) => value.replace(/(^[/])|([/]$)/g, ''),
      },
      {
        type: 'input',
        name: 'label',
        message: 'What is the route label?',
      },
      {
        type: 'input',
        name: 'variantName',
        message: 'What is the variant name?',
        default: 'default',
      },
      {
        type: 'list',
        name: 'httpVerb',
        message: 'Which HTTP verb?',
        default: 'GET',
        choices: supportedMethods,
      },
      {
        type: 'number',
        name: 'responseCode',
        message: 'What is the HTTP response code?',
        default: 200,
      },
      {
        type: 'input',
        name: 'responseExtension',
        message: 'What is the response file extension?',
        default: '.json',
        filter: (value) => {
          if (value[0] !== '.') {
            return '.'.concat(value);
          } else {
            return value;
          }
        },
      },
      {
        type: 'input',
        name: 'responseData',
        message: 'What data will it respond with?',
        default: '{}',
      },
    ],
    actions: function (data) {
      const { basePath, endpoint, httpVerb, variantName, responseExtension } =
        data;

      const endpointPath = path.join(basePath, endpoint);
      const variantPath = path.join(
        basePath,
        endpoint,
        httpVerb
        // variantName + responseExtension
      );

      const endpointIndexFile = path.join(endpointPath, 'index.js');
      const rootIndexFile = path.join(basePath, 'index.js');
      const actions = [];

      if (fs.existsSync(endpointIndexFile)) {
        actions.push('Modifying the route with the variant info');
        actions.push({
          type: 'modify',
          path: endpointIndexFile,
          templateFile: 'src/lib/templates/apiRouteAddVariant.js.hbs',
          pattern: new RegExp(
            `}\\);\n(\n)?(\\s*)// -- generator ${httpVerb} variant hook --`,
            'gi'
          ),
          abortOnFail: false,
        });
        actions.push('Modifying the route with http verb if it does not exist');
        actions.push({
          type: 'modify',
          path: endpointIndexFile,
          templateFile: 'src/lib/templates/apiRouteAddHttpVerb.js.hbs',
          pattern: new RegExp(
            `// -- unused generator ${httpVerb} variant hook --`,
            'gi'
          ),
          abortOnFail: false,
        });
      } else {
        const indexOfMethod = supportedMethods.indexOf(httpVerb);
        const unusedHttpMethods = supportedMethods.splice(0);
        unusedHttpMethods.splice(indexOfMethod, 1);

        actions.push('Creating a route');
        actions.push({
          type: 'add',
          path: endpointIndexFile,
          templateFile: 'src/lib/templates/apiRoute.js.hbs',
          data: { ...data, unusedHttpMethods },
        });

        if (!fs.existsSync(rootIndexFile)) {
          actions.push('Creating root index file');
          actions.push({
            type: 'add',
            path: rootIndexFile,
            template: `// -- generator import hook --\n// The above line is required for the generator and should not be changed`,
          });
        }

        actions.push('Importing the new route');
        actions.push({
          type: 'modify',
          path: rootIndexFile,
          template: `require('./{{endpoint}}');\r\n$1`,
          pattern: /(\/\/ -- generator import hook --)/gi,
        });
      }

      actions.push('Creating variant data');
      actions.push({
        type: 'addMany',
        destination: path.resolve(variantPath),
        base: 'src/lib/templates/variant',
        templateFiles: `src/lib/templates/variant/*`,

        // stripExtensions doesn't work if we're using handlebars to add a file extension
        // Ex {{variantName}}{{responseExtension}}.hbs should be default.json not default.json.hbs
        // There is an open PR https://github.com/plopjs/plop/pull/334 to support this. Uncomment below when it's merged

        // templateFiles: `src/lib/templates/variant/*.hbs`,
        // stripExtensions: ['hbs'],
      });

      return actions;
    },
  });
}
