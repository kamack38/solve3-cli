#!/bin/bash -

(
	cat <<'EOF'
# Maintainer: Kamack38 <kamack38.biznes@gmail.com>
_pkgname='solve3-cli'
pkgname="${_pkgname}-bin"
pkgver=SCLI_PKGVER
pkgrel=1
pkgdesc="CLI for solving problems at https://solve.edu.pl/"
arch=('any')
url="https://github.com/kamack38/solve3-cli"
license=('MIT')
depends=('jre-openjdk-headless')
provides=("${_pkgname}")
conflicts=("${_pkgname}")
source=("https://github.com/kamack38/solve3-cli/releases/download/$pkgver/solve3-linux.tgz")
sha256sums=('SKIP')

package() {
	install -D -m755 solve3 "${pkgdir}/usr/bin/solve3"
}
EOF
) | sed 's/pkgver=SCLI_PKGVER/pkgver='$(printf "$(git describe --abbrev=0)")'/' | sed "s/sha256sums=('SKIP')/sha256sums=('$(curl -L -s "https://github.com/kamack38/solve3-cli/releases/download/$(printf "$(git describe --abbrev=0)")/solve3-linux.tgz" | sha256sum | head -c 64)')/"
