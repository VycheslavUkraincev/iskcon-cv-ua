import Foundation
import PDFKit
import AppKit
// usage: swift pdf2png.swift <in.pdf> <outprefix> [scale]
let a = CommandLine.arguments; let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
let sc = a.count > 3 ? CGFloat(Double(a[3])!) : 1.0
print("pages", doc.pageCount)
for i in 0..<doc.pageCount {
  let pg = doc.page(at: i)!; let r = pg.bounds(for: .mediaBox)
  let img = NSImage(size: NSSize(width: r.width*sc, height: r.height*sc))
  img.lockFocus(); NSColor.white.set(); NSRect(x:0,y:0,width:r.width*sc,height:r.height*sc).fill()
  let ctx = NSGraphicsContext.current!.cgContext; ctx.scaleBy(x: sc, y: sc); pg.draw(with: .mediaBox, to: ctx); img.unlockFocus()
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.6])!.write(to: URL(fileURLWithPath: "\(a[2])-p\(i+1).jpg"))
}
