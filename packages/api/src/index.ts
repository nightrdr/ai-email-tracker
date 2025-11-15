export const startApi = (): string => {
  return 'API package ready';
};

if (require.main === module) {
  console.log(startApi());
}
