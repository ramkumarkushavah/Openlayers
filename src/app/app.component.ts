import { Component } from '@angular/core';
import * as $ from 'jquery';

declare let prototype;
declare let ol;
declare let d3, topojson;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  ngAfterViewInit(){
          var distance = <HTMLInputElement>document.getElementById('distance');
    
          var count = 20000;
          var features = new Array(count);
          var e = 4500000;
          for (var i = 0; i < count; ++i) {
            var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
            features[i] = new ol.Feature(new ol.geom.Point(coordinates));
          }
    
          var clusterSource = new ol.source.Cluster({
            distance: parseInt(distance.value, 10),
            source: new ol.source.Vector({
              features: features
            })
          });
    
          var styleCache = {};
          var clusters = new ol.layer.Vector({
            source: clusterSource,
            style: function(feature) {
              var size = feature.get('features').length;
              var style = styleCache[size];
              if (!style) {
                style = new ol.style.Style({
                  image: new ol.style.Circle({
                    radius: 10,
                    stroke: new ol.style.Stroke({
                      color: '#fff'
                    }),
                    fill: new ol.style.Fill({
                      color: '#3399CC'
                    })
                  }),
                  text: new ol.style.Text({
                    text: size.toString(),
                    fill: new ol.style.Fill({
                      color: '#fff'
                    })
                  })
                });
                styleCache[size] = style;
              }
              return style;
            }
          });
    
          distance.addEventListener('input', function() {
            clusterSource.setDistance(parseInt(distance.value, 10));
          });



      var  Pointer = ol.interaction.Pointer;
      var app = {Drag:Pointer};
      /**
       * @constructor
       * @extends {ol.interaction.Pointer}
       */
      app.Drag = function() {
            ol.interaction.Pointer.call(this, {
          handleDownEvent: app.Drag.prototype.handleDownEvent,
          handleDragEvent: app.Drag.prototype.handleDragEvent,
          handleMoveEvent: app.Drag.prototype.handleMoveEvent,
          handleUpEvent: app.Drag.prototype.handleUpEvent
        });

        /**
         * @type {ol.Pixel}
         * @private
         */
        this.coordinate_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.cursor_ = 'pointer';

        /**
         * @type {ol.Feature}
         * @private
         */
        this.feature_ = null;

        /**
         * @type {string|undefined}
         * @private
         */
        this.previousCursor_ = undefined;

      };

      ol.inherits(app.Drag, ol.interaction.Pointer);
          /**
           * @param {ol.MapBrowserEvent} evt Map browser event.
           * @return {boolean} `true` to start the drag sequence.
           */
          app.Drag.prototype.handleDownEvent = function(evt) {
            var map = evt.map;
    
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                  return feature;
                });
    
            if (feature) {
              this.coordinate_ = evt.coordinate;
              this.feature_ = feature;
            }
    
            return !!feature;
          };
    
    
          /**
           * @param {ol.MapBrowserEvent} evt Map browser event.
           */
          app.Drag.prototype.handleDragEvent = function(evt) {
            var deltaX = evt.coordinate[0] - this.coordinate_[0];
            var deltaY = evt.coordinate[1] - this.coordinate_[1];
    
            var geometry = /** @type {ol.geom.SimpleGeometry} */
                (this.feature_.getGeometry());
            geometry.translate(deltaX, deltaY);
    
            this.coordinate_[0] = evt.coordinate[0];
            this.coordinate_[1] = evt.coordinate[1];
          };
    
    
          /**
           * @param {ol.MapBrowserEvent} evt Event.
           */
          app.Drag.prototype.handleMoveEvent = function(evt) {
            if (this.cursor_) {
              var map = evt.map;
              var feature = map.forEachFeatureAtPixel(evt.pixel,
                  function(feature) {
                    return feature;
                  });
              var element = evt.map.getTargetElement();
              if (feature) {
                if (element.style.cursor != this.cursor_) {
                  this.previousCursor_ = element.style.cursor;
                  element.style.cursor = this.cursor_;
                }
              } else if (this.previousCursor_ !== undefined) {
                element.style.cursor = this.previousCursor_;
                this.previousCursor_ = undefined;
              }
            }
          };
    
    
    app.Drag.prototype.handleDownEvent = function(evt) {
      var map = evt.map;

      var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature) {
            return feature;
          });

      if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
      }

      return !!feature;
    };


    /**
     * @param {ol.MapBrowserEvent} evt Map browser event.
     */
    app.Drag.prototype.handleDragEvent = function(evt) {
      var deltaX = evt.coordinate[0] - this.coordinate_[0];
      var deltaY = evt.coordinate[1] - this.coordinate_[1];

      var geometry = /** @type {ol.geom.SimpleGeometry} */
          (this.feature_.getGeometry());
      geometry.translate(deltaX, deltaY);

      this.coordinate_[0] = evt.coordinate[0];
      this.coordinate_[1] = evt.coordinate[1];
    };


    /**
     * @param {ol.MapBrowserEvent} evt Event.
     */
    app.Drag.prototype.handleMoveEvent = function(evt) {
      if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
              return feature;
            });
        var element = evt.map.getTargetElement();
        if (feature) {
          if (element.style.cursor != this.cursor_) {
            this.previousCursor_ = element.style.cursor;
            element.style.cursor = this.cursor_;
          }
        } else if (this.previousCursor_ !== undefined) {
          element.style.cursor = this.previousCursor_;
          this.previousCursor_ = undefined;
        }
      }
    };


    /**
     * @return {boolean} `false` to stop the drag sequence.
     */
    app.Drag.prototype.handleUpEvent = function() {
      this.coordinate_ = null;
      this.feature_ = null;
      return false;
    };


    var pointFeature = new ol.Feature(new ol.geom.Point([0, 0]));

    
          var source = new ol.source.Vector({
            features: pointFeature
          });
    var vector = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.95,
          src: '../assets/images/marker.png'
        })),
        stroke: new ol.style.Stroke({
          width: 3,
          color: [255, 0, 0, 1]
        }),
        fill: new ol.style.Fill({
          color: [255, 255, 0, 0.6]
        })
      })
    })


    //osm layer creation
    var raster = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
    //wms layer creation
    var projExtent = ol.proj.get('EPSG:3857').getExtent();
    var startResolution = ol.extent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }
    var tileGrid = new ol.tilegrid.TileGrid({
      extent: [-13884991, 2870341, -7455066, 6338219],
      resolutions: resolutions,
      tileSize: [512, 256]
    });

    var wmslayer =         new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://ahocevar.com/geoserver/wms',
        params: {'LAYERS': 'topp:states', 'TILED': true},
        serverType: 'geoserver',
        tileGrid: tileGrid
      })
    })
    var logoElement = document.createElement('a');
    logoElement.href = 'https://www.osgeo.org/';
    logoElement.target = '_blank';

    var logoImage = document.createElement('img');
    logoImage.src = '../assets/images/logo.png';

    logoElement.appendChild(logoImage);


    var defaultStyle = {
      'Point': new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: 'rgba(255,255,0,0.5)'
          }),
          radius: 5,
          stroke: new ol.style.Stroke({
            color: '#ff0',
            width: 1
          })
        })
      }),
      'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f00',
          width: 3
        })
      }),
      'Polygon': new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(0,255,255,0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: '#0ff',
          width: 1
        })
      }),
      'MultiPoint': new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: 'rgba(255,0,255,0.5)'
          }),
          radius: 5,
          stroke: new ol.style.Stroke({
            color: '#f0f',
            width: 1
          })
        })
      }),
      'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#0f0',
          width: 3
        })
      }),
      'MultiPolygon': new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(0,0,255,0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: '#00f',
          width: 1
        })
      })
    };

    var styleFunction = function(feature, resolution) {
      var featureStyleFunction = feature.getStyleFunction();
      if (featureStyleFunction) {
        return featureStyleFunction.call(feature, resolution);
      } else {
        return defaultStyle[feature.getGeometry().getType()];
      }
    };

    var dragAndDropInteraction = new ol.interaction.DragAndDrop({
      formatConstructors: [
        ol.format.GPX,
        ol.format.GeoJSON,
        ol.format.IGC,
        ol.format.KML,
        ol.format.TopoJSON
      ]
    });






























    var view = new ol.View({
      center: [-8908887.277395891, 5381918.072437216],
      zoom: 12
    });
    //map creation
    var map = new ol.Map({
      interactions: ol.interaction.defaults().extend([dragAndDropInteraction]),
      loadTilesWhileAnimating: true,
      layers: [raster, wmslayer,clusters,vector],
      target: 'map',
      controls : ol.control.defaults().extend([new ol.control.ScaleLine(), new ol.control.ZoomSlider()]),
      renderer : 'canvas',
      view: view,
      logo: logoElement
    });
    











    























    dragAndDropInteraction.on('addfeatures', function(event) {
      var vectorSource = new ol.source.Vector({
        features: event.features
      });
      map.addLayer(new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
      }));
      map.getView().fit(vectorSource.getExtent());
    });

    var displayFeatureInfo = function(pixel) {
      var features = [];
      map.forEachFeatureAtPixel(pixel, function(feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        var info = [];
        var i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].get('name'));
        }
        document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
      } else {
        document.getElementById('info').innerHTML = '&nbsp;';
      }
    };

    map.on('pointermove', function(evt) {
      if (evt.dragging) {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    map.on('click', function(evt) {
      displayFeatureInfo(evt.pixel);
    });

      // generate a GetFeature request
      var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:3857',
        featureNS: 'http://openstreemap.org',
        featurePrefix: 'osm',
        featureTypes: ['water_areas'],
        outputFormat: 'application/json',
        filter: ol.format.filter.and(
            ol.format.filter.like('name', 'Mississippi*'),
            ol.format.filter.equalTo('waterway', 'riverbank')
        )
      });
      // then post the request and add the received features to a layer
      fetch('https://ahocevar.com/geoserver/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(function(response) {
        return response.json();
      }).then(function(json) {
        var features = new ol.format.GeoJSON().readFeatures(json);
        source.addFeatures(features);
        map.getView().fit(source.getExtent());
      });


      d3.json('https://openlayers.org/en/v4.5.0/examples/data/topojson/us.json', function(error, us) {
        var features = topojson.feature(us, us.objects.counties);

        /**
         * This function uses d3 to render the topojson features to a canvas.
         * @param {ol.Extent} extent Extent.
         * @param {number} resolution Resolution.
         * @param {number} pixelRatio Pixel ratio.
         * @param {ol.Size} size Size.
         * @param {ol.proj.Projection} projection Projection.
         * @return {HTMLCanvasElement} A canvas element.
         */
        var canvasFunction = function(extent, resolution, pixelRatio,
            size, projection) {
          var canvasWidth = size[0];
          var canvasHeight = size[1];

          var canvas = d3.select(document.createElement('canvas'));
          canvas.attr('width', canvasWidth).attr('height', canvasHeight);

          var context = canvas.node().getContext('2d');

          var d3Projection = d3.geo.mercator().scale(1).translate([0, 0]);
          var d3Path = d3.geo.path().projection(d3Projection);

          var pixelBounds = d3Path.bounds(features);
          var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
          var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

          var geoBounds = d3.geo.bounds(features);
          var geoBoundsLeftBottom = ol.proj.transform(
              geoBounds[0], 'EPSG:4326', projection);
          var geoBoundsRightTop = ol.proj.transform(
              geoBounds[1], 'EPSG:4326', projection);
          var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
          if (geoBoundsWidth < 0) {
            geoBoundsWidth += ol.extent.getWidth(projection.getExtent());
          }
          var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

          var widthResolution = geoBoundsWidth / pixelBoundsWidth;
          var heightResolution = geoBoundsHeight / pixelBoundsHeight;
          var r = Math.max(widthResolution, heightResolution);
          var scale = r / (resolution / pixelRatio);

          var center = ol.proj.transform(ol.extent.getCenter(extent),
              projection, 'EPSG:4326');
          d3Projection.scale(scale).center(center)
              .translate([canvasWidth / 2, canvasHeight / 2]);
          d3Path = d3Path.projection(d3Projection).context(context);
          d3Path(features);
          context.stroke();

          return canvas[0][0];
        };

        var layer = new ol.layer.Image({
          source: new ol.source.ImageCanvas({
            canvasFunction: canvasFunction,
            projection: 'EPSG:3857'
          })
        });
        map.addLayer(layer);
      });

    //draw logic
    var draw; // global so we can remove it later
    function addInteraction(val) {
      if (val !== 'None') {
        draw = new ol.interaction.Draw({
          source: source,
          type: /** @type {ol.geom.GeometryType} */ (val)
        });
        map.addInteraction(draw);
      }
    }
    function removeInteraction()
    {
      map.removeInteraction(draw);
    }

   $('#Point').click(function() {
      removeInteraction();
      addInteraction('Point');
    });

    $('#LineString').click(function() {
      removeInteraction();
      addInteraction('LineString');
    });
    $('#Polygon').click(function() {
      removeInteraction();
      addInteraction('Polygon');
    });
    $('#Circle').click(function() {
      removeInteraction();
      addInteraction('Circle');
    });
    $('#None').click(function() {
removeInteraction();
      addInteraction('None');
    });


    map.on('click', function(evt) {
      var coordinates = evt.coordinate;
      console.log(coordinates);
      var feature = map.forEachFeatureAtPixel(
        evt.pixel, function(ft, l) { return ft; }
    );

    if (feature) {
        var data = feature.getProperties();
        console.log(data)

    }

      }); 
      $('#moveElements').click(function(){
        removeInteraction();
        map.addInteraction(new app.Drag());
      });
    

      //dynamic data

      var imageStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          snapToPixel: false,
          fill: new ol.style.Fill({color: 'yellow'}),
          stroke: new ol.style.Stroke({color: 'red', width: 1})
        })
      });

      var headInnerImageStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 2,
          snapToPixel: false,
          fill: new ol.style.Fill({color: 'blue'})
        })
      });

      var headOuterImageStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          snapToPixel: false,
          fill: new ol.style.Fill({color: 'black'})
        })
      });

      var n = 200;
      var omegaTheta = 30000; // Rotation period in ms
      var R = 7e6;
      var r = 2e6;
      var p = 2e6;
      map.on('postcompose', function(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        var theta = 2 * Math.PI * frameState.time / omegaTheta;
        var coordinates = [];
        var i;
        for (i = 0; i < n; ++i) {
          var t = theta + 2 * Math.PI * i / n;
          var x = (R + r) * Math.cos(t) + p * Math.cos((R + r) * t / r);
          var y = (R + r) * Math.sin(t) + p * Math.sin((R + r) * t / r);
          coordinates.push([x, y]);
        }
        vectorContext.setStyle(imageStyle);
        vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));

        var headPoint = new ol.geom.Point(coordinates[coordinates.length - 1]);

        vectorContext.setStyle(headOuterImageStyle);
        vectorContext.drawGeometry(headPoint);

        vectorContext.setStyle(headInnerImageStyle);
        vectorContext.drawGeometry(headPoint);

        map.render();
      });
      map.render();

      function saveAs(b,m){}
      //download screenshot
      document.getElementById('export-png').addEventListener('click', function() {
        map.once('postcompose', function(event) {
          var canvas = event.context.canvas;
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
          } else {
            canvas.toBlob(function(blob) {
              saveAs(blob, 'map.png');
            });
          }
        });
        map.renderSync();
      });



      var polyline = [
        'hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}N',
        'fIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^',
        'aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_E',
        'kUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_',
        'Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@',
        'sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]k',
        'DuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mC',
        'um@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@ka',
        'i@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgB',
        'k_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__',
        'DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAw',
        'Xyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrX',
        'itAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@',
        'xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNma',
        'CsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_',
        'fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o',
        '~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAm',
        'b@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_',
        'lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknF',
        'oFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snA',
        'w`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDw',
        'zGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}',
        '@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwy',
        'A{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi',
        '@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC',
        '|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBb',
        'h@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipA',
        'dy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_',
        's@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCo',
        'SfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@',
        'oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e',
        '[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfY',
        'gEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~k',
        'Dyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB',
        '_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jI',
        'ab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@',
        'mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJ',
        'uEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m',
        '~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL'
      ].join('');

      var route = /** @type {ol.geom.LineString} */ (new ol.format.Polyline({
        factor: 1e6
      }).readGeometry(polyline, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }));

      var routeCoords = route.getCoordinates();
      var routeLength = routeCoords.length;

      var routeFeature = new ol.Feature({
        type: 'route',
        geometry: route
      });
      var geoMarker = new ol.Feature({
        type: 'geoMarker',
        geometry: new ol.geom.Point(routeCoords[0])
      });
      var startMarker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(routeCoords[0])
      });
      var endMarker = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(routeCoords[routeLength - 1])
      });

      var styles = {
        'route': new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 6, color: [237, 212, 0, 0.8]
          })
        }),
        'icon': new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/v4.5.0/examples/data/icon.png'
          })
        }),
        'geoMarker': new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'black'}),
            stroke: new ol.style.Stroke({
              color: 'white', width: 2
            })
          })
        })
      };

      var animating = false;
      var speed, now;
      var speedInput = <HTMLInputElement> document.getElementById('speed');
      var startButton = document.getElementById('start-animation');

      var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [routeFeature, geoMarker, startMarker, endMarker]
        }),
        style: function(feature) {
          // hide geoMarker if animation is active
          if (animating && feature.get('type') === 'geoMarker') {
            return null;
          }
          return styles[feature.get('type')];
        }
      });

      map.addLayer(vectorLayer);

      var moveFeature = function(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;

        if (animating) {
          var elapsedTime = frameState.time - now;
          // here the trick to increase speed is to jump some indexes
          // on lineString coordinates
          var index = Math.round(speed * elapsedTime / 1000);

          if (index >= routeLength) {
            stopAnimation(true);
            return;
          }

          var currentPoint = new ol.geom.Point(routeCoords[index]);
          var feature = new ol.Feature(currentPoint);
          vectorContext.drawFeature(feature, styles.geoMarker);
        }
        // tell OpenLayers to continue the postcompose animation
        map.render();
      };

      function startAnimation() {
        map.getView().setCenter([-5639523.95, -3501274.52]);
        if (animating) {
          stopAnimation(false);
        } else {
          animating = true;
          now = new Date().getTime();
          speed = speedInput.value;
          startButton.textContent = 'Cancel Animation';
          // hide geoMarker
          geoMarker.setStyle(null);
          map.on('postcompose', moveFeature);
          map.render();
        }
      }


      /**
       * @param {boolean} ended end of animation.
       */
      function stopAnimation(ended) {
        animating = false;
        startButton.textContent = 'Start Animation';

        // if animation cancelled set the marker at the beginning
        var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
        /** @type {ol.geom.Point} */ (geoMarker.getGeometry())
            .setCoordinates(coord);
        //remove listener
        map.un('postcompose', moveFeature);
      }

      startButton.addEventListener('click', startAnimation, false);



      //overlaying 
      var pos = ol.proj.fromLonLat([16.3725, 48.208889]);
      
            // Vienna marker
            var marker = new ol.Overlay({
              position: pos,
              positioning: 'center-center',
              element: document.getElementById('marker'),
              stopEvent: false
            });
            map.addOverlay(marker);
      
            // Vienna label
            var vienna = new ol.Overlay({
              position: pos,
              element: document.getElementById('vienna')
            });
            map.addOverlay(vienna);
      
            // Popup showing the position the user clicked
            var popup = new ol.Overlay({
              element: document.getElementById('popup')
            });
            map.addOverlay(popup);
      
            map.on('click', function(evt) {
              var element = popup.getElement();
              var coordinate = evt.coordinate;
              var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
                  coordinate, 'EPSG:3857', 'EPSG:4326'));
      
              $(element).popover('destroy');
              popup.setPosition(coordinate);
              // the keys are quoted to prevent renaming in ADVANCED mode.
              $(element).popover({
                'placement': 'top',
                'animation': false,
                'html': true,
                'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
              });
              $(element).popover('show');
            });


            //animation

            var london = ol.proj.fromLonLat([-0.12755, 51.507222]);
            var moscow = ol.proj.fromLonLat([37.6178, 55.7517]);
            var istanbul = ol.proj.fromLonLat([28.9744, 41.0128]);
            var rome = ol.proj.fromLonLat([12.5, 41.9]);
            var bern = ol.proj.fromLonLat([7.4458, 46.95]);

            // A bounce easing method (from https://github.com/DmitryBaranovskiy/raphael).
            function bounce(t) {
              var s = 7.5625, p = 2.75, l;
              if (t < (1 / p)) {
                l = s * t * t;
              } else {
                if (t < (2 / p)) {
                  t -= (1.5 / p);
                  l = s * t * t + 0.75;
                } else {
                  if (t < (2.5 / p)) {
                    t -= (2.25 / p);
                    l = s * t * t + 0.9375;
                  } else {
                    t -= (2.625 / p);
                    l = s * t * t + 0.984375;
                  }
                }
              }
              return l;
            }
      
            // An elastic easing method (from https://github.com/DmitryBaranovskiy/raphael).
            function elastic(t) {
              return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
            }
      
            function onClick(id, callback) {
              document.getElementById(id).addEventListener('click', callback);
            }
      
            onClick('rotate-left', function() {
              view.animate({
                rotation: view.getRotation() + Math.PI / 2
              });
            });
      
            onClick('rotate-right', function() {
              view.animate({
                rotation: view.getRotation() - Math.PI / 2
              });
            });
      
            onClick('rotate-around-rome', function() {
              // Rotation animation takes the shortest arc, so animate in two parts
              var rotation = view.getRotation();
              view.animate({
                rotation: rotation + Math.PI,
                anchor: rome,
                easing: ol.easing.easeIn
              }, {
                rotation: rotation + 2 * Math.PI,
                anchor: rome,
                easing: ol.easing.easeOut
              });
            });
      
            onClick('pan-to-london', function() {
              view.animate({
                center: london,
                duration: 2000
              });
            });
      
            onClick('elastic-to-moscow', function() {
              view.animate({
                center: moscow,
                duration: 2000,
                easing: elastic
              });
            });
      
            onClick('bounce-to-istanbul', function() {
              view.animate({
                center: istanbul,
                duration: 2000,
                easing: bounce
              });
            });
      
            onClick('spin-to-rome', function() {
              // Rotation animation takes the shortest arc, so animate in two parts
              var center = view.getCenter();
              view.animate({
                center: [
                  center[0] + (rome[0] - center[0]) / 2,
                  center[1] + (rome[1] - center[1]) / 2
                ],
                rotation: Math.PI,
                easing: ol.easing.easeIn
              }, {
                center: rome,
                rotation: 2 * Math.PI,
                easing: ol.easing.easeOut
              });
            });
      
            function flyTo(location, done) {
              var duration = 2000;
              var zoom = view.getZoom();
              var parts = 2;
              var called = false;
              function callback(complete) {
                --parts;
                if (called) {
                  return;
                }
                if (parts === 0 || !complete) {
                  called = true;
                  done(complete);
                }
              }
              view.animate({
                center: location,
                duration: duration
              }, callback);
              view.animate({
                zoom: zoom - 1,
                duration: duration / 2
              }, {
                zoom: zoom,
                duration: duration / 2
              }, callback);
            }
      
            onClick('fly-to-bern', function() {
              flyTo(bern, function() {});
            });
      
            function tour() {
              var locations = [london, bern, rome, moscow, istanbul];
              var index = -1;
              function next(more) {
                if (more) {
                  ++index;
                  if (index < locations.length) {
                    var delay = index === 0 ? 0 : 750;
                    setTimeout(function() {
                      flyTo(locations[index], next);
                    }, delay);
                  } else {
                    alert('Tour complete');
                  }
                } else {
                  alert('Tour cancelled');
                }
              }
              next(true);
            }
      
            onClick('tour', tour);
  }
}
