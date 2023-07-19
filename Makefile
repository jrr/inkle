tarball=out/inkle-0.0.0-testing.tgz

dist/cli.js:
	yarn build

# todo: after dropping node 14, use '--pack-destination out' instead of moving file
$(tarball): dist/cli.js
	mkdir -p out
	npm version --allow-same-version --no-git-tag-version 0.0.0-testing
	npm pack
	mv inkle-0.0.0-testing.tgz out/

# installing latest version of npm because certain old versions fail
test-npx-node-16: $(tarball)
	docker run --entrypoint bash -v $(PWD)/out:/out node:16-buster -c 'npm i -g npm && npm exec -y file:///out/inkle-0.0.0-testing.tgz -- --test midgame --quit'

test-npx-node-18: $(tarball)
	docker run --entrypoint bash -v $(PWD)/out:/out node:18-buster -c 'npm i -g npm && npm exec -y file:///out/inkle-0.0.0-testing.tgz -- --test midgame --quit'

test-npx-node-20: $(tarball)
	docker run --entrypoint bash -v $(PWD)/out:/out node:20-buster -c 'npm i -g npm && npm exec -y file:///out/inkle-0.0.0-testing.tgz -- --test midgame --quit'

interactive-node-16: $(tarball)
	docker run -it --entrypoint bash -v $(PWD)/out:/out node:16-buster

interactive-node-18: $(tarball)
	docker run -it --entrypoint bash -v $(PWD)/out:/out node:18-buster

clean:
	rm -rf dist