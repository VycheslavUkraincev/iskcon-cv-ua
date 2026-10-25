import Foundation
import Vision
import AppKit
// usage: swift faces.swift <img>...  -> prints: path \t x,y,w,h (normalized, origin top-left) ; ...
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("\(path)\tERR"); continue }
  let req = VNDetectFaceRectanglesRequest()
  let h = VNImageRequestHandler(cgImage: cg, options: [:])
  try? h.perform([req])
  let faces = (req.results ?? []).map { f -> String in let b = f.boundingBox; return String(format: "%.3f,%.3f,%.3f,%.3f", b.origin.x, 1 - b.origin.y - b.size.height, b.size.width, b.size.height) }
  print("\(path)\t\(cg.width)x\(cg.height)\t\(faces.joined(separator: ";"))")
}
