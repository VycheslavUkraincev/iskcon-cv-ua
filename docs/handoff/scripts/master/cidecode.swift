import CoreImage
import Foundation
for path in CommandLine.arguments.dropFirst() {
  guard let img = CIImage(contentsOf: URL(fileURLWithPath: path)) else { print(path, "LOAD_FAIL"); continue }
  let d = CIDetector(ofType: CIDetectorTypeQRCode, context: nil, options: [CIDetectorAccuracy: CIDetectorAccuracyHigh])!
  let f = d.features(in: img).compactMap { ($0 as? CIQRCodeFeature)?.messageString }
  print(path.split(separator: "/").last!, f.count, f.first ?? "NONE")
}
