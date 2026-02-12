import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Backend corriendo en: http://localhost:${PORT}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || "development"}`);
});
