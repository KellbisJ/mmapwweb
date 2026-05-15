export class NodeHandler {
  constructor() {
    this.nodes = new Map();
    this.nextId = 1;
  }

  addNode(id, element, parentId) {
    this.nodes.set(id, { id, element, parentId, childrenIds: [] });
    if (parentId !== null && this.nodes.has(parentId)) {
      this.nodes.get(parentId).childrenIds.push(id);
    }
  }

  getNode(id) {
    return this.nodes.get(id);
  }

  deleteNode(id) {
    const node = this.nodes.get(id);
    if (!node) return [];

    if (node.parentId !== null) {
      const parent = this.nodes.get(node.parentId);
      if (parent) {
        const idx = parent.childrenIds.indexOf(id);
        if (idx !== -1) parent.childrenIds.splice(idx, 1);
      }
    }

    this.nodes.delete(id);

    return [node];
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  clear() {
    this.nodes.clear();
    this.nextId = 1;
  }
}
