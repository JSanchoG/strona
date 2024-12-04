import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

g = 9.81  # grawitacja

def liczenie_belki(m, L, Xa, Xb):
    F = m * g
    if Xa == Xb:
        return F / 2, F / 2
    Rb = (F * (L / 2 - Xa)) / (L - Xa - Xb)
    Ra = F - Rb
    return Ra, Rb

def aktualizacja():
    try:
        m = float(mass_entry.get())
        L = float(length_entry.get())
        Xa = float(Xa_entry.get())
        Xb = float(Xb_entry.get())

        if m <= 0 or L <= 0 or Xa < 0 or Xb < 0:
            raise ValueError("Input musi być większy od 0.")

        if Xa > L / 2 or Xb > L / 2:
            raise ValueError("Xa oraz Xb muszą być równe lub mniejsze od połowy długości L.")

        Ra, Rb = liczenie_belki(m, L, Xa, Xb)
        Ra_label.config(text=f"Rₐ = {Ra:.2f} N")
        Rb_label.config(text=f"Rᵦ = {Rb:.2f} N")
    except ValueError as e:
        messagebox.showerror("Nieprawidłowy input", str(e))

def validate_input(char):
    return char.isdigit() or char == "."

# GUI
root = tk.Tk()
root.title("Kalkulator Belki")
root.geometry("300x400")
root.configure(bg="#f7f7f7")

style = ttk.Style()
style.configure("TButton", font=("Helvetica", 10, "bold"), padding=6)
style.configure("TLabel", font=("Helvetica", 10))
style.configure("TEntry", font=("Helvetica", 10), padding=5)

input_frame = ttk.Frame(root, padding=(10, 10))
input_frame.grid(row=0, column=0, padx=20, pady=20)

vcmd = (root.register(validate_input), '%S')

# GUI Input
ttk.Label(input_frame, text="Masa (kg):").grid(row=0, column=0, sticky="W", pady=5)
mass_entry = ttk.Entry(input_frame, validate="key", validatecommand=vcmd)
mass_entry.grid(row=0, column=1)
mass_entry.insert(0, "100")

ttk.Label(input_frame, text="Długość (m):").grid(row=1, column=0, sticky="W", pady=5)
length_entry = ttk.Entry(input_frame, validate="key", validatecommand=vcmd)
length_entry.grid(row=1, column=1)
length_entry.insert(0, "100")

ttk.Label(input_frame, text="Xa (m):").grid(row=2, column=0, sticky="W", pady=5)
Xa_entry = ttk.Entry(input_frame, validate="key", validatecommand=vcmd)
Xa_entry.grid(row=2, column=1)
Xa_entry.insert(0, "0")

ttk.Label(input_frame, text="Xb (m):").grid(row=3, column=0, sticky="W", pady=5)
Xb_entry = ttk.Entry(input_frame, validate="key", validatecommand=vcmd)
Xb_entry.grid(row=3, column=1)
Xb_entry.insert(0, "0")

# Wynik
wynik_frame = ttk.Frame(root, padding=(10, 10))
wynik_frame.grid(row=1, column=0, padx=20, pady=10)

Ra_label = ttk.Label(wynik_frame, text="Rₐ", font=("Helvetica", 12, "bold"))
Ra_label.grid(row=0, column=0, pady=10)

Rb_label = ttk.Label(wynik_frame, text="Rᵦ", font=("Helvetica", 12, "bold"))
Rb_label.grid(row=1, column=0, pady=10)

# Przycisk Oblicz
calc_button = ttk.Button(root, text="Oblicz", command=aktualizacja)
calc_button.grid(row=2, column=0, pady=10)

root.mainloop()