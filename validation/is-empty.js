const isEmpty = value =>
     value === undefined ||
     value === null ||
     // object vide
     (typeof value === 'object' && Object.keys(value).length === 0) ||
     // trim() enlève les blancs en début et fin de chaîne
     (typeof value === 'string' && value.trim().length === 0);

     module.exports = isEmpty;
