import { fabric } from "fabric";
import { IFabricNS } from "..";
import { divideBy } from "../misc/divideBy";
import { fabricObjectDefaults } from "../misc/Fabric/fabricObjectDefaults";
import { getObjectCoordsAndReset } from "../misc/Fabric/getObjectCoordsAndReset";
import { getObjectMaskedByRectangle } from "../misc/getObjectMaskedByRectangle";
import { defaultPosition } from "../misc/Position/defaultPosition";
import { IGetFittedObjectPayload } from "../types/IGetFittedObjectPayload";

export const getFillFittedObject = (
  object: fabric.Object,
  options: IGetFittedObjectPayload,
  ns: IFabricNS
) => {
  const {
    width,
    height,
    position: { x = defaultPosition.x, y = defaultPosition.y } = {}
  } = options;

  const { left, top } = getObjectCoordsAndReset(object);

  object.scaleX = divideBy(width, object.width!);
  object.scaleY = divideBy(height, object.height!);

  const objectWrapper = new ns.Group([object], {
    ...fabricObjectDefaults
  });

  objectWrapper.set({
    left: x.getAbsolute(width, objectWrapper.width!),
    top: y.getAbsolute(height, objectWrapper.height!)
  });

  objectWrapper.setCoords();

  const group = getObjectMaskedByRectangle(
    { width, height, object: objectWrapper },
    ns
  );

  group.set({ left, top });
  group.setCoords();

  return group;
};
