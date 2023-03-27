require "language/node"

class AwesomeTouping < Formula
  desc "Efficient tool to cast local video file to Airplay"
  homepage "https://github.com/AndyBoat/awesome-touping"
  url "https://registry.npmjs.org/awesome-touping/-/awesome-touping-1.0.2.tgz"
  version "1.0.2"
  # curl -Ls https://registry.npmjs.org/awesome-touping/-/awesome-touping-1.0.2.tgz | shasum -a 256
  sha256 "62658b04f35b0c76775afd2f1ceb515961f951e9374c6c2fae0cd25ff3c2cc52"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
  end
end
