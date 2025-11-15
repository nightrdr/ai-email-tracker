export const initExtension = (): string => {
  return 'Extension scaffold ready';
};

if (require.main === module) {
  console.log(initExtension());
}
