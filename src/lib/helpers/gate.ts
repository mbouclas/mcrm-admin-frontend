
export default (gate: string | string[], gates: string[]) => {
  let isValid = false;

  if (typeof isValid === 'string') {
    let idx = gates.findIndex(gt => gt.gate === gate);
    isValid = idx !== -1;
  }
  if (Array.isArray(gate)) {
    gate.forEach(g => {
      let idx = gates.findIndex(ga => ga.gate === g);
      isValid = idx !== -1;
      if (isValid) {
        return;
      }
    })
  }

  return isValid;
}