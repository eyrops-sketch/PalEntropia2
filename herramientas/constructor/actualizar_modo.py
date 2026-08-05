# ==========================================================
# actualizar_modo.py v1.0
# PalEntropía
# Fase 1 - Lectura de palmodo.csv
# ==========================================================

import csv

CSV_ENTRADA = "palmodo.csv"

print("========================================")
print(" PalEntropía - Actualizador de Modo")
print(" Fase 1 - Leyendo palmodo.csv")
print("========================================\n")

registros = []

with open(CSV_ENTRADA, "r", encoding="utf-8") as archivo:

    lector = csv.DictReader(archivo)

    for fila in lector:
        registros.append(fila)

print("Registros leídos:", len(registros))
print()

for fila in registros:

    print(
        fila["codigo"],
        fila["nombre"],
        "MV" + fila["MV"],
        fila["SM_L_ES_C"]
    )

print("\nLectura completada correctamente.")





