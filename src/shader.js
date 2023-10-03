export default function ({ passes, config, sizes, time }) {
    passes.horizontalBlurPass = new ShaderPass(BlurPass);
    passes.horizontalBlurPass.strength = config.touch ? 0 : 1;
    passes.horizontalBlurPass.material.uniforms.uResolution.value =
        new THREE.Vector2(sizes.viewport.width, sizes.viewport.height);
    passes.horizontalBlurPass.material.uniforms.uStrength.value =
        new THREE.Vector2(passes.horizontalBlurPass.strength, 0);

    passes.verticalBlurPass = new ShaderPass(BlurPass);
    passes.verticalBlurPass.strength = config.touch ? 0 : 1;
    passes.verticalBlurPass.material.uniforms.uResolution.value =
        new THREE.Vector2(sizes.viewport.width, sizes.viewport.height);
    passes.verticalBlurPass.material.uniforms.uStrength.value =
        new THREE.Vector2(0, passes.verticalBlurPass.strength);

    passes.glowsPass = new ShaderPass(GlowsPass);
    passes.glowsPass.color = "#ffcfe0";
    passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(
        0,
        0.25
    );
    passes.glowsPass.material.uniforms.uRadius.value = 0.7;
    passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(
        passes.glowsPass.color
    );
    passes.glowsPass.material.uniforms.uAlpha.value = 0.55;

    passes.composer.addPass(passes.horizontalBlurPass);
    passes.composer.addPass(passes.verticalBlurPass);
    passes.composer.addPass(passes.glowsPass);

    time.on("tick", () => {
        passes.horizontalBlurPass.enabled =
            passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0;
        passes.verticalBlurPass.enabled =
            passes.verticalBlurPass.material.uniforms.uStrength.value.y > 0;
    });

    // Resize event
    sizes.on("resize", () => {
        passes.horizontalBlurPass.material.uniforms.uResolution.value.x =
            sizes.viewport.width;
        passes.horizontalBlurPass.material.uniforms.uResolution.value.y =
            sizes.viewport.height;
        passes.verticalBlurPass.material.uniforms.uResolution.value.x =
            sizes.viewport.width;
        passes.verticalBlurPass.material.uniforms.uResolution.value.y =
            sizes.viewport.height;
    });
}
