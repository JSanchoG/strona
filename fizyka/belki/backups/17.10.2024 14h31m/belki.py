def fizyka(m, L, Xa, Xb, g=9.81):
    F = m * g
    Rb = (F * (L / 2 - Xa)) / (L - Xa - Xb)
    Ra = F - Rb
    return Ra, Rb

# Get user input
m = float(input("Wprowadź masę (kg): "))
L = float(input("Wprowadź długość (m): "))
Xa = float(input("Wprowadź Xa (dystans od lewej strony, m): "))
Xb = float(input("Wprowadź Xb (dystant od prawej strony, m): "))
g_input = input("Wprowadź g (domyślnie 9.81): ")
g = float(g_input) if g_input else 9.81


# Calculate results
Ra, Rb = fizyka(m, L, Xa, Xb)

# Display the results
print(f"Ra: {Ra} N\nRb: {Rb} N")
