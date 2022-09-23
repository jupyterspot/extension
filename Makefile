# mamba create -n jspot-ext python=3.9 -y
install:
 	mamba install -c conda-forge jupyterlab==3.0 nodejs
	pip install -e .
	jupyter labextension develop . --overwrite
