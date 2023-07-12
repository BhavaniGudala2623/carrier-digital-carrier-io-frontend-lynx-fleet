export const isProductFamilyHE = (groupName: string) => {
  const productFamily = groupName?.split(/\s/g)[0];

  if (productFamily.endsWith('/HE')) {
    return true;
  }

  return false;
};
