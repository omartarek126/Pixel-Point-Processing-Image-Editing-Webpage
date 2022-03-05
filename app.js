
//Displays the original image after being uploaded
function displayOriginalImage(event) {
  if (event.files.length != 0) {
    if (checkFileName(event.files[0].name)) {
      document.getElementById("inputImage").src = window.URL.createObjectURL(event.files[0]);
      document.getElementById("originalImage").style.display = "initial";
      document.getElementById("transformation").style.display = "initial";
      document.getElementById("result").style.display = "none";
    }
  }
}

//Makes sure the uploaded file is a png or jpg image 
function checkFileName(fileName) {
  if (fileName == "") {
    alert("Browse to upload a valid File with png or jpg extension");
    return false;
  }
  else if (fileName.split(".")[1].toUpperCase() == "PNG" || fileName.split(".")[1].toUpperCase() == "JPG")
    return true;
  else {
    alert("File with " + fileName.split(".")[1] + " is invalid. Upload a valid file with png or jpg extensions");
    return false;
  }
}

//Displays the corresponding form to the selected transformation and hides the other forms
function showTransformForm() {
  const increaseBrightnessForm = document.getElementById("increaseBrightnessForm");
  const decreaseBrightnessForm = document.getElementById("decreaseBrightnessForm");
  const increaseContrastForm = document.getElementById("increaseContrastForm");
  const decreaseContrastForm = document.getElementById("decreaseContrastForm");
  const inverseFunctionForm = document.getElementById("inverseFunctionForm");

  const increaseBrightnessInputs = document.getElementById("increaseBrightnessInputs");
  const decreaseBrightnessInputs = document.getElementById("decreaseBrightnessInputs");
  const increaseContrastInputs = document.getElementById("increaseContrastInputs");
  const decreaseContrastInputs = document.getElementById("decreaseContrastInputs");
  const inverseFunctionInputs = document.getElementById("inverseFunctionInputs");

  const mylist = document.getElementById("myList");

  //Storing the type chosen in a variable
  transformType = mylist.options[mylist.selectedIndex].text;

  //Displaying to the user the type he chose by changing the text element of id= transformType to the selected type
  document.getElementById("transformType").innerText = transformType;

  //Hiding and showing forms depending on the chosen transform type
  if (transformType == "Increase Brightness") {
    increaseBrightnessInputs.style.display = "initial";
    decreaseBrightnessInputs.style.display = "none";
    increaseContrastInputs.style.display = "none";
    decreaseContrastInputs.style.display = "none";
    inverseFunctionInputs.style.display = "none";

  } else if (transformType == "Decrease Brightness") {
    increaseBrightnessInputs.style.display = "none";
    decreaseBrightnessInputs.style.display = "initial";
    increaseContrastInputs.style.display = "none";
    decreaseContrastInputs.style.display = "none";
    inverseFunctionInputs.style.display = "none";

  } else if (transformType == "Increase Contrast") {
    increaseBrightnessInputs.style.display = "none";
    decreaseBrightnessInputs.style.display = "none";
    increaseContrastInputs.style.display = "initial";
    decreaseContrastInputs.style.display = "none";
    inverseFunctionInputs.style.display = "none";

  } else if (transformType == "Decrease Contrast") {
    increaseBrightnessInputs.style.display = "none";
    decreaseBrightnessInputs.style.display = "none";
    increaseContrastInputs.style.display = "none";
    decreaseContrastInputs.style.display = "initial";
    inverseFunctionInputs.style.display = "none";
  } else {
    increaseBrightnessInputs.style.display = "none";
    decreaseBrightnessInputs.style.display = "none";
    increaseContrastInputs.style.display = "none";
    decreaseContrastInputs.style.display = "none";
    inverseFunctionInputs.style.display = "initial";
  }

  // Listener to the event of submiting the increase brightness form
  increaseBrightnessForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var ib = document.getElementById("ib").value
    increaseBrightness(Number(ib))
  });
  decreaseBrightnessForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var db = document.getElementById("db").value
    decreaseBrightness(Number(db))
  });
  increaseContrastForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var icOrgBd = document.getElementById("icOrgBd").value
    var icOrgDb = document.getElementById("icOrgDb").value
    var icTrfBd = document.getElementById("icTrfBd").value
    var icTrfDb = document.getElementById("icTrfDb").value
    increaseContrast(Number(icOrgBd), Number(icOrgDb), Number(icTrfBd), Number(icTrfDb))
  });
  decreaseContrastForm.addEventListener("submit", (e) => {
    e.preventDefault()
    var dcOrgBd = document.getElementById("dcOrgBd").value
    var dcOrgDb = document.getElementById("dcOrgDb").value
    var dcTrfBd = document.getElementById("dcTrfBd").value
    var dcTrfDb = document.getElementById("dcTrfDb").value
    decreaseContrast(Number(dcOrgBd), Number(dcOrgDb), Number(dcTrfBd), Number(dcTrfDb))
  });
  inverseFunctionForm.addEventListener("submit", (e) => {
    e.preventDefault()
    inverseFunction()
  });


  //Applies pixel-wise transformations to increase brightness
  function increaseBrightness(ib) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    //Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      val = rgba[i] + ib;
      if (val > 255) {
        val = 255;
      }
      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);

  }

  function decreaseBrightness(db) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      if (rgba[i] <= db) {
        val = 0;
      }
      else {
        val = (255 / (255 - db)) * (rgba[i] - db);
      }

      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);
  }

  function increaseContrast(icOrgBd, icOrgDb, icTrfBd, icTrfDb) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      if (rgba[i] <= icOrgBd) {
        val = (icTrfBd / icOrgBd) * rgba[i];
      }
      else if (rgba[i] >= icOrgDb) {
        val = (((255 - icTrfDb) / (255 - icOrgDb)) * (rgba[i] - icOrgDb)) + icTrfDb;
      }
      else {
        val = (((icTrfDb - icTrfBd) / (icOrgDb - icOrgBd)) * (rgba[i] - icOrgBd)) + icTrfBd;
      }

      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);
  }

  function decreaseContrast(dcOrgBd, dcOrgDb, dcTrfBd, dcTrfDb) {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      if (rgba[i] <= dcOrgBd) {
        val = (dcTrfBd / dcOrgBd) * rgba[i];
      }
      else if (rgba[i] >= dcOrgDb) {
        val = (((255 - dcTrfDb) / (255 - dcOrgDb)) * (rgba[i] - dcOrgDb)) + dcTrfDb;
      }
      else {
        val = (((dcTrfDb - dcTrfBd) / (dcOrgDb - dcOrgBd)) * (rgba[i] - dcOrgBd)) + dcTrfBd;
      }

      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);
  }

  function inverseFunction() {
    const img = document.getElementById("inputImage");
    const canvas = document.getElementById("resultImage");
    const ctx = canvas.getContext('2d');

    var transformedImage = [];
    var val;

    rgba = getRGBAValues(img, canvas, ctx);

    for (i = 0; i < img.width * img.height * 4; i += 4) {
      val = 255 - rgba[i];

      transformedImage.push(val, val, val, rgba[i + 3]);
    }

    displayResultImage(img, transformedImage, ctx);
  }



  //Extracts rgba 1D array of all the pixels in the original image
  function getRGBAValues(img, canvas, ctx) {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    var rgba = ctx.getImageData(
      0, 0, img.width, img.height
    ).data;
    return rgba;
  }

  //Displays the transformed image
  function displayResultImage(img, transformedImage, ctx) {
    //Get a pointer to the current location in the image.
    var palette = ctx.getImageData(0, 0, img.width, img.height); //x,y,w,h
    //Wrap your array as a Uint8ClampedArray
    palette.data.set(new Uint8ClampedArray(transformedImage)); // assuming values 0..255, RGBA, pre-mult.
    //Repost the data.
    ctx.putImageData(palette, 0, 0);
    document.getElementById("result").style.display = "initial";
  }
}  