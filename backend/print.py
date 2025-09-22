import zebra

printer = zebra.Zebra()

# Get the list of available printers
printers = printer.getqueues()
print("Available Printers:", printers)

# Set the printer to use (replace 'Zebra' with the actual name of your printer)
printer.setqueue("Zebra ZD230")  # Adjust this to match your printer's name

# ZPL command for a sample bin card
zpl = """
^XA
^FO50,50^ADN,36,20^FDProduct Name:^FS
^FO50,100^ADN,36,20^FDWidget X200^FS
^FO50,150^ADN,36,20^FDPart Number:^FS
^FO50,200^ADN,36,20^FD123456789^FS
^FO50,250^ADN,36,20^FDLocation:^FS
^FO50,300^ADN,36,20^FDRack A - Bin 42^FS
^FO50,350^ADN,36,20^FDQuantity:^FS
^FO50,400^ADN,36,20^FD150 Units^FS
^FO50,450^ADN,36,20^FDDate Added:^FS
^FO50,500^ADN,36,20^FD2025-01-09^FS
^XZ
"""

# Send the ZPL to the printer
try:
    printer.output(zpl)
    print("Bin card printed successfully!")
except Exception as e:
    print("Error printing bin card:", str(e))
