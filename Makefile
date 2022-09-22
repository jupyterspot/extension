
# mamba create -n jspot-ext python=3.9 -y
install:
	mamba install -c conda-forge nodejs
	pip install -e .
	jupyter labextension develop . --overwrite

watch:
	jlpm watch
