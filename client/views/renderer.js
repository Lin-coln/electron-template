void main();
async function main() {
  const result = await window.electron.invoke_service("foobar", ["foobar"], []);
  console.log("invoke service:", { result });
}
