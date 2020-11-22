const isMacroCall = (token) => token.type === 'Macro';

const macroUse = (data) => {
  const macros = {};
  data.tokens.forEach((token) => {
    if (isMacroCall(token)) {
      macros[`@${token.text}`] = macros[`@${token.text}`] ? macros[`@${token.text}`] + 1 : 1;
    }
  });
  return macros;
};

module.exports = macroUse;
