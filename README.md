
# MediTransfer

MediTransfer is a tool for generating and exporting patient data in the GDT 3.5 format. It converts form data into a structured .gdt file that can be easily imported into medical software systems such as Tomedo. This streamlines data transfer, ensuring that patient information is efficiently handled and integrated with medical practice management systems.

---

## Features

- Generates GDT 3.5 Files: Converts user-submitted data into the required format for German medical software systems.
- Secure Data Handling: Captures sensitive patient information and saves it as structured data in a .gdt file.
- Simple Integration: Saves files in a designated folder where medical software (e.g. Tomedo) can automatically access and import them.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 12 or later)
- [npm](https://www.npmjs.com/)

### Steps

1. Download the Zip file or clone the repo with:

```bash
   git clone https://github.com/PaniAdel/MediTransfer.git
```

2. To access cloned directory run:

```bash
   cd MediTransfer
```

### Install

> To install node and other project's dependencies run:

```bash
   npm install
```

### run

> To run install nodemon and run:

```bash
    npx nodemon index.js
```



---

## Usage

1. Run the server:
```bash
    nodemon App.js
```
   

2. Open your web browser and navigate to http://localhost:3000 to access the patient data form.

3. Fill out the form with patient details and submit. The data will be processed and saved as a .gdt file in the /Users/Shared/tomedo/gdt-import/ directory.

---

## Authors

👤 Elhama Adel

- GitHub:[@PaniAdel](https://github.com/PaniAdel)
   

## License

This project is licensed under the MIT License.
