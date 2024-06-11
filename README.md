# MRI Visualization
It displays MRI in 2D and 3D multi-slice views, with easy search and navigation with a mouse.

### 2D
![2D](./assets/2d.gif)

### 3D
![3D](./assets/3d.gif)


## Table of content
* [Motivation](#motivation)
* [Content](#content)
* [New Features](#new-features)
* [Usage](#usage)
* [Development](#development)
* [License](#license)
* [Author](#author)


## Motivation
A part of university project made for the course **Biomedical Image Visualization** at Peking University.

Magnetic Resonance Imaging (MRI) is a medical imaging technique used in radiology to form pictures of the anatomy and the physiological processes of the body.


## Content
* **files**: an example of the NII file type, which is primarily associated with NIfTI-1 Data Format.
* **visualization_2D**: source code to visualize the MRI image in 2 dimensions and interact with a 3D mouse.
* **volume**: source code to visualize the MRI image in 3 dimensions and interact with a 3D mouse.

## New Features
- use a backend server to load, rename and save the NII file
- send the renamed file to the frontend
- prevent the bug that the temporary file miss the .nii.gz extension

## Usage
Clone the repository
```bash
git clone 
```
Install the dependencies
```bash
cd mri-visulization/server
npm install
```
Run the server
```bash
npm start
```
Run the frontend

- For 2D visualization
```bash
cd mri-visulization/slices_visulization
npx serve .
```
- For 3D visualization
```bash
cd mri-visulization/volume_rendering
npx serve .
```
Open the browser and go to address showing in the terminal

## Development
* **Neuroimaging Informatics Technology Initiative ([NIFTI](https://nifti.nimh.nih.gov/))**: format for multi-dimensional neuroimaging data, to represent the MRI.


* **AMI Medical Imaging (AMI) Javascript Toolkit([ami](https://github.com/FNNDSC/ami))**: to show the NIFTI type files in 2D and 3D on the browser.

* **[three.js](https://github.com/mrdoob/three.js/)**: the others libraries are based on three.js, so it is essential to know how it works.


## License
MIT License


## Author
Tony Cao ([@caolonghao](https://github.com/caolonghao))
