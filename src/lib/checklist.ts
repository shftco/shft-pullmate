import { markdownParser } from '@app/lib';

function extractErrorMessages(): string[] {
  const nodes = markdownParser.parseContentAsJSON();
  const errorMessages: any = [];

  for (const node of nodes) {
    const error = extractNodeError(node);

    if (error) {
      errorMessages.push(error.flat());
    }
  }

  return errorMessages.flat(Infinity);
}

function extractNodeError(node: CheckListNodeType): (string[] | string)[] {
  const errors = [];

  if (node.isRequired && !node.isChecked) {
    errors.push(':red_circle: **You must to check** "' + node.q + '"');
  }

  if (node.children.length > 0 && node.isChecked) {
    for (const child of node.children) {
      const error = extractNodeError(child);

      if (error) {
        errors.push(typeof error === 'string' ? error : error.flat());
      }
    }
  }

  return errors;
}

export default { extractErrorMessages };
