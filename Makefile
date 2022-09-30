VERSION ?= 0.4.0

# conda activate jspot-ext-02
# mamba create -n jspot-ext python=3.9 -y
install:
	mamba install -c conda-forge jupyterlab==3.0 nodejs
	pip install -e .
	jupyter labextension develop . --overwrite

# also update version in `package.json` manually!
bump:
	hatch version $(VERSION)

list:
	ls dist/*$(VERSION)*

build:
	python -m build
	jlpm build

publish:
	twine upload dist/*$(VERSION)*
	npm publish --access public
