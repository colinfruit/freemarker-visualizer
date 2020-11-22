const isMacroDefinition = (token) => token.type === 'Directive' && token.text === 'macro' && token.params;

const macroDefinitionsPlugin = (data) => {
  const macroDefinitions = { };
  data.tokens.forEach((token) => {
    if (isMacroDefinition(token)) {
      const macroName = token.params.split(' ')[0];
      macroDefinitions['Macro Definitions'] = macroDefinitions['Macro Definitions']
        ? `${macroDefinitions['Macro Definitions']}\n${macroName}`
        : `\n${macroName}`;
    }
  });
  return macroDefinitions;
};

module.exports = macroDefinitionsPlugin;
