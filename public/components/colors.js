class Colors {

  setFirstColors() {
    let setWhite = {
      red: 255,
      green: 255,
      blue: 255
    };
    let setBlack = {
      red: 0,
      green: 0,
      blue: 0
    };

    palette.push(setWhite);
    palette.push(setBlack);

    //Note:helpers and rough colors


    let helpersColors = [{
        type: "separator"
      },
      {
        red: 111,
        green: 185,
        blue: 228
      },
      {
        red: 219,
        green: 119,
        blue: 129
      },
      {
        type: "separator"
      },
      {
        red: 5,
        green: 141,
        blue: 243
      }, //RGB(5, 141, 243)
      {
        red: 245,
        green: 224,
        blue: 90
      }, //RGB(245, 224, 90)
      {
        red: 236,
        green: 47,
        blue: 57
      }, //RGB(236, 47, 57)
      {
        red: 98,
        green: 225,
        blue: 97
      } //RGB(98, 225, 97)
    ];

    for (let helper of helpersColors) {
      palette.push(helper);
    }

    //Note: Gifastic Colors Of the Month
    let gifastic = [{
        type: "separator"
      },
      {
        red: 129,
        green: 131,
        blue: 142
      },
      {
        red: 241,
        green: 226,
        blue: 138
      },
      {
        red: 186,
        green: 62,
        blue: 51
      }
    ];

    for (let skin of gifastic) {
      palette.push(skin);
    }
    //
    // let hairPalette = [
    //   {type: "separator"},
    //   {red: 50, green: 25, blue: 18},//RGB(50, 25, 18)
    //   {red: 50, green: 30, blue: 25},//RGB(50, 30, 25)
    //   {red: 29, green: 14, blue: 11},//RGB(29, 14, 11)
    //   {red: 247, green: 208, blue: 181},//RGB(247, 208, 181)
    //   {red: 229, green: 185, blue: 145},//RGB(229, 185, 145)
    //   {red: 241, green: 195, blue: 155},//RGB(241, 195, 155)
    //   {red: 188, green: 94, blue: 0},//RGB(188, 94, 0)
    //   {red: 206, green: 116, blue: 41},//RGB(206, 116, 41)
    //   {red: 135, green: 59, blue: 0},//RGB(135, 59, 0)
    //   {red: 21, green: 25, blue: 32},//RGB(21, 25, 32)
    //   {red: 17, green: 15, blue: 10},//RGB(17, 15, 10)
    //   {red: 12, green: 13, blue: 17},//RGB(12, 13, 17)
    //   {red: 69, green: 35, blue: 14},//RGB(69, 35, 14)
    //   {red: 57, green: 29, blue: 12},//RGB(57, 29, 12)
    //   {red: 76, green: 44, blue: 22},//RGB(76, 44, 22)
    //   {red: 31, green: 31, blue: 31},//RGB(31, 31, 31)
    //   {red: 50, green: 50, blue: 50},//RGB(50, 50, 50)
    //   {red: 19, green: 21, blue: 20},//RGB(19, 21, 20)
    //   {red: 206, green: 176, blue: 121},//RGB(206, 176, 121)
    //   {red: 191, green: 151, blue: 73},//RGB(191, 151, 73)
    //   {red: 203, green: 161, blue: 64},//RGB(203, 161, 64)
    //   {red: 23, green: 14, blue: 11},//RGB(23, 14, 11)
    //   {red: 32, green: 19, blue: 18},//RGB(32, 19, 18)
    //   {red: 24, green: 13, blue: 6}//RGB(24, 13, 6)
    // ];
    //
    // for (let hair of hairPalette){
    //   palette.push(hair);
    // }
    //
    // let skinPalette = [
    //   {type: "separator"},
    //   {red: 234, green: 167, blue: 165}, //RGB(234, 167, 165)
    //   {red: 205, green: 146, blue: 145}, //RGB(205, 146, 145)
    //   {red: 166, green: 98, blue: 96}, //RGB(166, 98, 96)
    //   {red: 228, green: 168, blue: 147}, //RGB(228, 168, 147)
    //   {red: 214, green: 155, blue: 137}, //RGB(214, 155, 137)
    //   {red: 191, green: 132, blue: 111}, //RGB(191, 132, 111)
    //   {red: 207, green: 164, blue: 146}, //RGB(207, 164, 146)
    //   {red: 194, green: 143, blue: 122}, //RGB(194, 143, 122)
    //   {red: 172, green: 120, blue: 99}, //RGB(172, 120, 99)
    //   {red: 244, green: 214, blue: 219}, //RGB(244, 214, 219)
    //   {red: 247, green: 199, blue: 210}, //RGB(247, 199, 210)
    //   {red: 210, green: 176, blue: 182}, //RGB(210, 176, 182)
    //   {red: 146, green: 83, blue: 63}, //RGB(146, 83, 63)
    //   {red: 99, green: 57, blue: 45}, //RGB(99, 57, 45)
    //   {red: 108, green: 51, blue: 34}, //RGB(108, 51, 34)
    //   {red: 191, green: 108, blue: 61}, //RGB(191, 108, 61)
    //   {red: 171, green: 95, blue: 57}, //RGB(171, 95, 57)
    //   {red: 139, green: 67, blue: 22}, //RGB(139, 67, 22)
    //   {red: 231, green: 202, blue: 197}, //RGB(231, 202, 197)
    //   {red: 214, green: 181, blue: 172}, //RGB(214, 181, 172)
    //   {red: 203, green: 177, blue: 170}, //RGB(203, 177, 170)
    //   {red: 189, green: 132, blue: 104},  //RGB(189, 132, 104)
    //   {red: 171, green: 116, blue: 88}, //RGB(171, 116, 88)
    //   {red: 162, green: 105, blue: 75}  //RGB(162, 105, 75)
    // ];
    // for (let skin of skinPalette){
    //   palette.push(skin);
    // }
    this.getColor();
  };

  storeColor() {
    let color = {
      red: csR,
      green: csV,
      blue: csB
    };
    palette.push(color);
    this.getColor();
    this.updatePLScroll();
  };

  getColor() {
    paletteHandle = [];
    paletteHandle = palette;
    //console.log("This is the palette handle array: ");
    //console.log(paletteHandle);
    let elts = selectAll('.pltcolor');
    for (let i = 0; i < elts.length; i++) {
      elts[i].remove();
    };

    paletteHandle.forEach(function(couleur) {

      if (couleur.type == undefined) {
        // //console.log(couleur);

        let span = createElement('span');
        span.html('<i class="fas fa-tint"></i>');
        let plt = createA('javascript:', '');
        plt.class('pltcolor');

        // ahref.mouseOver(showAnim);
        plt.touchStarted(function() {
          // selectPencilTool();
          //console.log(couleur);
          setR = couleur.red;
          sliderR.value(setR);
          setV = couleur.green;
          sliderV.value(setV);
          setB = couleur.blue;
          sliderB.value(setB);
          //console.log(setR, setV, setB);
        });

        plt.touchEnded(function() {
          redraw();
        });

        span.parent(plt);

        plt.parent('yourPalette');
        plt.class("pltcolor");
        plt.style("color", "rgb(" + couleur.red + "," + couleur.green + "," + couleur.blue + ")");
      } else if (couleur.type) {
        let span = createElement('span');
        span.html(' <i class="fas fa-circle"></i> ');
        span.addClass('separator');
        span.addClass('pltcolor');
        span.parent('yourPalette');
      }
    });
  };

  updatePLScroll() {

  };
}
