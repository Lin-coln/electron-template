void main();
async function main() {
  const result = await window.electron.service.invoke(["foobar"], []);
  console.log(result);
}
