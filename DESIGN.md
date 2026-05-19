# Design System — Visual Language & Design Tokens

Welcome to the **Apex Driving Academy** visual language system. This document outlines the rationale and specifications for our custom-tailored Tailwind CSS design system. It is engineered to feel premium, precise, and dynamic, representing high-performance vehicle control and safety.

---

## 1. Color Palette (Non-Generic Dark Theme)

We avoid generic black, white, and flat grays. Our visual environment is anchored in a high-contrast, atmospheric deep navy slate, offset by electric energetic highlights and traffic warning tones.

| Token | Hex Value | Role | Rationale |
| :--- | :--- | :--- | :--- |
| `navy-950` | `#0A0E1A` | **Base Background** | The foundation of our application. A premium, deep midnight navy representing focus and high-end night-driving elegance. |
| `navy-900` | `#0F1422` | **Panel Base** | Card and component container background. |
| `navy-500` | `#2563EB` | **Primary Brand** | Electric Blue. Promotes confidence, trust, and advanced electronic precision. |
| `amber-500` | `#F59E0B` | **Accent Highlight** | Active Amber/Gold. Symbolizes road markers, indicators, headlight beams, and active safety states. |

---

## 2. Typography & Letter-Spacing

We use **Outfit** for geometric, high-impact mechanical display headings and **Inter** for clean, legible interfaces. The typography system includes a strict **9-step type scale** that locks size, line-height, and precise letter-spacings for maximum visual rhythm.

### Typographic Scale

1. **Step 1 (12px / 0.75rem)**: Line Height: `16px` | Letter Spacing: `0.02em` (caps/utility text)
2. **Step 2 (14px / 0.875rem)**: Line Height: `20px` | Letter Spacing: `0.01em` (labels/small text)
3. **Step 3 (16px / 1rem)**: Line Height: `24px` | Letter Spacing: `0` (default body text)
4. **Step 4 (18px / 1.125rem)**: Line Height: `28px` | Letter Spacing: `-0.01em` (sub-headers/intro copy)
5. **Step 5 (20px / 1.25rem)**: Line Height: `28px` | Letter Spacing: `-0.01em` (card headers)
6. **Step 6 (24px / 1.5rem)**: Line Height: `32px` | Letter Spacing: `-0.02em` (sections subheadings)
7. **Step 7 (30px / 1.875rem)**: Line Height: `36px` | Letter Spacing: `-0.02em` (modal/major titles)
8. **Step 8 (36px / 2.25rem)**: Line Height: `40px` | Letter Spacing: `-0.03em` (main section headers)
9. **Step 9 (48px / 3rem)**: Line Height: `48px` | Letter Spacing: `-0.04em` (hero displays)

---

## 3. Spacing Grid (4px Base)

All margins, paddings, and gaps conform to a base **4px grid** to enforce absolute alignment. We define named semantic tokens for key spacing layouts:

* **`space-tight`**: `8px` (Icon to text gap, micro margins)
* **`space-inline`**: `16px` (List items gap, small component pads)
* **`space-gap`**: `24px` (Grid layout standard spacing)
* **`space-card`**: `32px` (Internal padding of cards and modals)
* **`space-section`**: `120px` (Generous vertical spacing between block sections for breathing room)

---

## 4. Animation Easing Curves

Animations are not generic. They mimic mechanical physical movement: spring suspension, smooth accelerations, and sharp shifts. Mapped in `index.css` as custom properties and referenced in Tailwind config:

* **Spring (`--ease-spring`)**: `cubic-bezier(0.68, -0.6, 0.32, 1.6)`
  * *Behavior*: Bouncy overshoot representing physical vehicle suspension response.
* **Smooth (`--ease-smooth`)**: `cubic-bezier(0.4, 0, 0.2, 1)`
  * *Behavior*: Traditional elegant progressive deceleration.
* **Snap (`--ease-snap`)**: `cubic-bezier(0.77, 0, 0.175, 1)`
  * *Behavior*: Highly responsive mechanical engagement (like shifting gears).

---

## 5. Road Sign Icon System

Icons are located in `src/lib/icons/road-signs.tsx` as fully functional React TSX components with customizable `size` and glowing effect parameters.

1. **Stop Sign (`StopSign`)**: Bold red octagonal outline with vector text inside.
2. **Yield Sign (`YieldSign`)**: Downward-pointing triangular yield sign with red border.
3. **Speed Limit Sign (`SpeedLimitSign`)**: Circular limit badge which accepts custom parameterized limits, e.g., `<SpeedLimitSign limit={60} />`.
4. **No Entry Sign (`NoEntrySign`)**: Red circle with centered horizontal block.
5. **Pedestrian Crossing Sign (`PedestrianCrossingSign`)**: Diamond shape with high-intensity warning amber fill and custom pedestrian silhouette drawing paths.
6. **Traffic Light (`TrafficLight`)**: High-fidelity modular controller that represents active states (`red`, `yellow`, `green`, `all`, `none`) with custom shadow glows.
