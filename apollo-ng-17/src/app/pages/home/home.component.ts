import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import * as ort from 'onnxruntime-web';

// Configure the WASM backend path for onnxruntime-web
ort.env.wasm.wasmPaths = 'assets/';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    FormsModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    ChartModule,
    RatingModule,
    KnobModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  knobValue: number = 90;
  selectedWeek: any;
  weeks: any[] = [];
  barData: any;
  barOptions: any;
  pieData: any;
  pieOptions: any;
  products: Product[] = [];
  subscription: Subscription;
  cols: any[] = [];

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  videoStream: MediaStream | null = null;
  detectionInterval: any;

  // Global boxes array – initially empty.
  boxes: any[] = [];

  // COCO classes used by YOLOv8 (adjust if using a custom model)
  yoloClasses: string[] = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
    'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
    'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
    'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse',
    'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator',
    'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
  ];

  constructor(
    private productService: ProductService,
    private layoutService: LayoutService
  ) {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe((config) => {
        this.initCharts();
      });
  }

  async ngOnInit(): Promise<void> {
    await this.startCamera();

    // (The following weeks, charts, products, and columns code remains unchanged.)
    this.weeks = [
      {
        label: 'Last Week',
        value: 0,
        data: [
          [65, 59, 80, 81, 56, 55, 40],
          [28, 48, 40, 19, 86, 27, 90],
        ],
      },
      {
        label: 'This Week',
        value: 1,
        data: [
          [35, 19, 40, 61, 16, 55, 30],
          [48, 78, 10, 29, 76, 77, 10],
        ],
      },
    ];

    this.selectedWeek = this.weeks[0];
    this.initCharts();

    this.productService.getProductsSmall().then((data) => (this.products = data));

    this.cols = [
      { header: 'Name', field: 'name' },
      { header: 'Category', field: 'category' },
      { header: 'Price', field: 'price' },
      { header: 'Status', field: 'inventoryStatus' },
    ];
  }

  async initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barData = {
      labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: documentStyle.getPropertyValue('--primary-500'),
          barThickness: 12,
          borderRadius: 12,
          data: this.selectedWeek.data[0],
        },
        {
          label: 'Profit',
          backgroundColor: documentStyle.getPropertyValue('--primary-200'),
          barThickness: 12,
          borderRadius: 12,
          data: this.selectedWeek.data[1],
        },
      ],
    };

    this.pieData = {
      labels: ['Electronics', 'Fashion', 'Household'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue('--primary-700'),
            documentStyle.getPropertyValue('--primary-400'),
            documentStyle.getPropertyValue('--primary-100'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--primary-600'),
            documentStyle.getPropertyValue('--primary-300'),
            documentStyle.getPropertyValue('--primary-200'),
          ],
        },
      ],
    };

    this.barOptions = {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: 700,
            },
            padding: 28,
          },
          position: 'bottom',
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieOptions = {
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: 700,
            },
            padding: 28,
          },
          position: 'bottom',
        },
      },
    };
  }

  onWeekChange() {
    let newBarData = { ...this.barData };
    newBarData.datasets[0].data = this.selectedWeek.data[0];
    newBarData.datasets[1].data = this.selectedWeek.data[1];
    this.barData = newBarData;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.stopCamera();
  }

  async startCamera(): Promise<void> {
    try {
      // Stop previous stream if necessary
      if (this.videoStream) {
        this.stopCamera();
      }

      // Request webcam access
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.videoStream;

      // When the video starts playing, begin the detection loop.
      this.videoElement.nativeElement.addEventListener('play', () => {
        const canvas = this.canvasElement.nativeElement;
        // Set canvas size to match video dimensions.
        canvas.width = this.videoElement.nativeElement.videoWidth;
        canvas.height = this.videoElement.nativeElement.videoHeight;
        const context = canvas.getContext('2d')!;

        this.detectionInterval = setInterval(async () => {
          // Draw the current video frame
          context.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);
          // Overlay bounding boxes from the previous frame
          this.draw_boxes(canvas, this.boxes);
          // Prepare input from the canvas (resizing to 640x640 and normalizing)
          const input = this.prepareInput(canvas);
          // Run the model inference
          const output = await this.runModel(input);
          // Process model output to update boxes for the next iteration
          this.boxes = this.processOutput(output, canvas.width, canvas.height);
        }, 30);
      });
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
    }
    if (this.videoElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  /**
   * Prepare the input for the YOLOv8 model:
   * - Resize the current canvas image to 640x640
   * - Normalize pixel values (divide by 255)
   * - Rearrange the pixels: first reds, then greens, then blues
   */
  prepareInput(canvas: HTMLCanvasElement): number[] {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 640;
    tempCanvas.height = 640;
    const tempContext = tempCanvas.getContext('2d')!;
    tempContext.drawImage(canvas, 0, 0, 640, 640);

    const imageData = tempContext.getImageData(0, 0, 640, 640).data;
    const red: number[] = [];
    const green: number[] = [];
    const blue: number[] = [];

    for (let i = 0; i < imageData.length; i += 4) {
      red.push(imageData[i] / 255);
      green.push(imageData[i + 1] / 255);
      blue.push(imageData[i + 2] / 255);
    }
    return [...red, ...green, ...blue];
  }

  /**
   * Run the YOLOv8 ONNX model using onnxruntime-web.
   * (For efficiency, consider loading the model once rather than on every frame.)
   */
  async runModel(input: number[]): Promise<Float32Array> {
    const session = await ort.InferenceSession.create('assets/yolov8s.onnx');
    const tensor = new ort.Tensor('float32', Float32Array.from(input), [1, 3, 640, 640]);
    const feeds = { images: tensor };
    const results = await session.run(feeds);
    // Assumes the model output is named "output0"
    return results['output0'].data as Float32Array;
  }

  /**
   * Process the raw model output to extract bounding boxes.
   * Each box is returned as an object: { x1, y1, x2, y2, label, prob }.
   */
  processOutput(output: Float32Array, imgWidth: number, imgHeight: number): any[] {
    let boxes: any[] = [];
    const numAnchors = 8400;  // Model-specific: number of predictions
    const numClasses = 80;    // Change if using a different model

    for (let i = 0; i < numAnchors; i++) {
      let classId = 0;
      let maxProb = 0;
      for (let c = 0; c < numClasses; c++) {
        const prob = output[numAnchors * (c + 4) + i];
        if (prob > maxProb) {
          maxProb = prob;
          classId = c;
        }
      }
      if (maxProb < 0.5) continue;

      const xc = output[i];
      const yc = output[numAnchors + i];
      const w = output[2 * numAnchors + i];
      const h = output[3 * numAnchors + i];

      const x1 = ((xc - w / 2) / 640) * imgWidth;
      const y1 = ((yc - h / 2) / 640) * imgHeight;
      const x2 = ((xc + w / 2) / 640) * imgWidth;
      const y2 = ((yc + h / 2) / 640) * imgHeight;
      boxes.push({ x1, y1, x2, y2, label: this.yoloClasses[classId], prob: maxProb });
    }

    // Sort by probability and apply Non-Maximum Suppression (NMS)
    boxes = boxes.sort((a, b) => b.prob - a.prob);
    const finalBoxes: any[] = [];
    while (boxes.length) {
      const currentBox = boxes.shift();
      finalBoxes.push(currentBox);
      boxes = boxes.filter(box => this.iou(currentBox, box) < 0.7);
    }
    return finalBoxes;
  }

  // --- Helper functions for Non-Maximum Suppression (NMS) ---

  iou(box1: any, box2: any): number {
    return this.intersection(box1, box2) / this.union(box1, box2);
  }

  union(box1: any, box2: any): number {
    const area1 = (box1.x2 - box1.x1) * (box1.y2 - box1.y1);
    const area2 = (box2.x2 - box2.x1) * (box2.y2 - box2.y1);
    return area1 + area2 - this.intersection(box1, box2);
  }

  intersection(box1: any, box2: any): number {
    const x1 = Math.max(box1.x1, box2.x1);
    const y1 = Math.max(box1.y1, box2.y1);
    const x2 = Math.min(box1.x2, box2.x2);
    const y2 = Math.min(box1.y2, box2.y2);
    return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  }

  /**
   * Draw bounding boxes on the canvas.
   * This function sets the stroke, fill, and font styles, then draws a rectangle and label for each box.
   */
  draw_boxes(canvas: HTMLCanvasElement, boxes: any[]): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 3;
    ctx.font = "18px serif";

    boxes.forEach(box => {
      // Draw bounding rectangle
      ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
      // Draw label background
      ctx.fillStyle = "#00FF00";
      const width = ctx.measureText(box.label).width;
      ctx.fillRect(box.x1, box.y1, width + 10, 25);
      // Draw label text
      ctx.fillStyle = "#000000";
      ctx.fillText(box.label, box.x1, box.y1 + 18);
    });
  }
}
