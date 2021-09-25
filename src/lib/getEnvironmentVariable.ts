export const getEnvironmentVariable = (variable: string): string => {
  const value = process.env[variable];
  if (value == null) {
    throw new Error(`${variable} environemnt variable not set`);
  }

  return value;
}
