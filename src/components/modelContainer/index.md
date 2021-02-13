
## ModelContainer

Demo:

```tsx
import React from 'react';
import { ModelContainer } from 'gllib-threejs';

export default () => (
  <ModelContainer 
    modelUrl="http://127.0.0.1:8080/RobotExpressive.glb" 
    style={{background: 'antiquewhite'}}
    autoRotate={false}
    modelRotation={{y: -50}}
    rotateSpeed={100}
    modelScale={2}
  />
);
```