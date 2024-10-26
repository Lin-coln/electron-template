void main();
async function main() {
  const result = await window.electron.service.invoke("foobar", ["foobar"], []);
  console.log("invoke service:", { result });
}
