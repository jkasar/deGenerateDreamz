function shade() {
			var camera, scene, renderer;
			var composer;
			var cube;
			var shaderTime = 0;

			var testParams, testPass;			


			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 20, 3000);
				camera.position.z = 1000;

				scene = new THREE.Scene();

				//Create an image texture
				var imgTexture = THREE.ImageUtils.loadTexture( "../img/sky.jpeg" );
				var imgMaterial = new THREE.MeshBasicMaterial( { 
					map : imgTexture
				} );

				//create plane
				var geometry = new THREE.PlaneGeometry(1800*2, 1600,1,1);
				var plane = new THREE.Mesh(geometry, imgMaterial);
				scene.add(plane);
				plane.position.z = - 500;

				
				//Create an image texture
				var imgTexture2 = THREE.ImageUtils.loadTexture( "../img/testcard.jpg" );
				var imgMaterial2 = new THREE.MeshBasicMaterial( { 
					map : imgTexture2
				} );

				//create cube
				var geometry = new THREE.CubeGeometry(500, 500, 500);
				cube = new THREE.Mesh(geometry, imgMaterial2);
				scene.add(cube);
				
				//init renderer
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				//add stats
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.body.appendChild( renderer.domElement );

				//POST PROCESSING
				//Create Shader Passes
				renderPass = new THREE.RenderPass( scene, camera );
				copyPass = new THREE.ShaderPass( THREE.CopyShader );

				bloomPass = new THREE.BloomPass(1,25,4.0,256);
				
				colorifyPass = new THREE.ShaderPass( THREE.ColorifyShader );
				colorifyPass.uniforms[ "color" ].value = new THREE.Color( 0xff0000 );

				bleachPass = new THREE.ShaderPass( THREE.BleachBypassShader );
				bleachPass.uniforms[ "opacity" ].value = 3.0;

				brightnessContrastPass = new THREE.ShaderPass( THREE.BrightnessContrastShader );
				brightnessContrastPass.uniforms[ "contrast" ].value = 0.8;
				
				colorCorrectionPass = new THREE.ShaderPass( THREE.ColorCorrectionShader );

				filmPass = new THREE.ShaderPass( THREE.FilmShader );
				filmPass.uniforms[ "sCount" ].value = 800;
				filmPass.uniforms[ "sIntensity" ].value = 0.9;
				filmPass.uniforms[ "nIntensity" ].value = 0.4;
				
				dotScreenPass = new THREE.ShaderPass( THREE.DotScreenShader );

				focusPass = new THREE.ShaderPass( THREE.FocusShader );
			
				horizontalBlurPass = new THREE.ShaderPass( THREE.HorizontalBlurShader );
				
				hueSaturationPass = new THREE.ShaderPass( THREE.HueSaturationShader );
				hueSaturationPass.uniforms[ "hue" ].value = 0.5;
				hueSaturationPass.uniforms[ "saturation" ].value = .5;

				kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );

				luminosityPass = new THREE.ShaderPass( THREE.LuminosityShader );

				mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );
				
				RGBShiftPass = new THREE.ShaderPass( THREE.RGBShiftShader );

				sepiaPass = new THREE.ShaderPass( THREE.SepiaShader );
				
				verticalBlurPass = new THREE.ShaderPass( THREE.VerticalBlurShader );
				
				vignettePass = new THREE.ShaderPass( THREE.VignetteShader );
				vignettePass.uniforms[ "darkness" ].value = 2.0;
				

				//Init control Panel
				shaderParams = {
					bleach:false,
					bloom:false,
					brightnessContrast:false,
					colorCorrection:false,
					colorify:false,	
					dotScreen: false,				
					film:false,
					focus:false,					
					horizontalBlur:false,					
					hueSaturation:false,					
					kaleido:false,					
					luminosity:false,					
					mirror:false,					
					RGBShift:false,					
					sepia:false,					
					verticalBlur:false,					
					vignette:false,					
				}

				var gui = new dat.GUI();
				gui.add(shaderParams, 'bleach').onChange(onToggleShaders);
				gui.add(shaderParams, 'bloom').onChange(onToggleShaders);
				gui.add(shaderParams, 'brightnessContrast').onChange(onToggleShaders);
				gui.add(shaderParams, 'colorCorrection').onChange(onToggleShaders);
				gui.add(shaderParams, 'colorify').onChange(onToggleShaders);
				gui.add(shaderParams, 'dotScreen').onChange(onToggleShaders);
				gui.add(shaderParams, 'film').onChange(onToggleShaders);
				gui.add(shaderParams, 'focus').onChange(onToggleShaders);
				gui.add(shaderParams, 'horizontalBlur').onChange(onToggleShaders);
				gui.add(shaderParams, 'hueSaturation').onChange(onToggleShaders);
				gui.add(shaderParams, 'kaleido').onChange(onToggleShaders);
				gui.add(shaderParams, 'luminosity').onChange(onToggleShaders);
				gui.add(shaderParams, 'mirror').onChange(onToggleShaders);
				gui.add(shaderParams, 'RGBShift').onChange(onToggleShaders);
				gui.add(shaderParams, 'sepia').onChange(onToggleShaders);
				gui.add(shaderParams, 'verticalBlur').onChange(onToggleShaders);
				gui.add(shaderParams, 'vignette').onChange(onToggleShaders);
				onToggleShaders();
			}

			function onToggleShaders() {

				composer = new THREE.EffectComposer( renderer);
				
				//Add Shader Passes to Composer

				composer.addPass( renderPass );
				
				if (shaderParams.bleach){
					composer.addPass( bleachPass );
				}
				if (shaderParams.bloom){
					composer.addPass( bloomPass );
				}
				if (shaderParams.brightnessContrast){
					composer.addPass( brightnessContrastPass );
				}
				if (shaderParams.colorCorrection){
					composer.addPass( colorCorrectionPass );
				}
				if (shaderParams.colorify){
					composer.addPass( colorifyPass );
				}
				if (shaderParams.dotScreen){
					composer.addPass( dotScreenPass );
				}
				if (shaderParams.film){
					composer.addPass( filmPass );
				}				
				if (shaderParams.focus){
					composer.addPass( focusPass );
				}
				if (shaderParams.horizontalBlur){
					composer.addPass( horizontalBlurPass );
				}
				if (shaderParams.hueSaturation){
					composer.addPass( hueSaturationPass );
				}
				if (shaderParams.kaleido){
					composer.addPass( kaleidoPass );
				}
				if (shaderParams.luminosity){
					composer.addPass( luminosityPass );
				}
				if (shaderParams.mirror){
					composer.addPass( mirrorPass );
				}
				if (shaderParams.RGBShift){
					composer.addPass( RGBShiftPass );
				}
				if (shaderParams.sepia){
					composer.addPass( sepiaPass );
				}				
				if (shaderParams.verticalBlur){
					composer.addPass( verticalBlurPass );
				}
				if (shaderParams.vignette){
					composer.addPass( vignettePass );
				}

				composer.addPass( copyPass );
				//set last pass in composer chain to renderToScreen
				copyPass.renderToScreen = true;
			}

			function animate() {
				requestAnimationFrame( animate );
				cube.rotation.y -= 0.01;
				cube.rotation.x += 0.005;
				composer.render( 0.1);
				stats.update();
			}
		}
