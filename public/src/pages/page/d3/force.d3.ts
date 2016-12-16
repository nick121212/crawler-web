import * as d3 from 'd3';
import * as _ from 'lodash';

var defaultLinks = [
    { source: "Microsoft", target: "Amazon", type: "licensing" },
    { source: "Microsoft", target: "HTC", type: "licensing" },
    { source: "Samsung", target: "Apple", type: "suit" },
    { source: "Motorola", target: "Apple", type: "suit" },
    { source: "Nokia", target: "Apple", type: "resolved" },
    { source: "HTC", target: "Apple", type: "suit" },
    { source: "Kodak", target: "Apple", type: "suit" },
    { source: "Microsoft", target: "Barnes & Noble", type: "suit" },
    { source: "Microsoft", target: "Foxconn", type: "suit" },
    { source: "Oracle", target: "Google", type: "suit" },
    { source: "Apple", target: "HTC", type: "suit" },
    { source: "Microsoft", target: "Inventec", type: "suit" },
    { source: "Samsung", target: "Kodak", type: "resolved" },
    { source: "LG", target: "Kodak", type: "resolved" },
    { source: "RIM", target: "Kodak", type: "suit" },
    { source: "Sony", target: "LG", type: "suit" },
    { source: "Kodak", target: "LG", type: "resolved" },
    { source: "Apple", target: "Nokia", type: "resolved" },
    { source: "Qualcomm", target: "Nokia", type: "resolved" },
    { source: "Apple", target: "Motorola", type: "suit" },
    { source: "Microsoft", target: "Motorola", type: "suit" },
    { source: "Motorola", target: "Microsoft", type: "suit" },
    { source: "Huawei", target: "ZTE", type: "suit" },
    { source: "Ericsson", target: "ZTE", type: "suit" },
    { source: "Kodak", target: "Samsung", type: "resolved" },
    { source: "Apple", target: "Samsung", type: "suit" },
    { source: "Kodak", target: "RIM", type: "suit" },
    { source: "Nokia", target: "Qualcomm", type: "suit" }
];

interface NodeModel {
    title: string;
    type: string;
}

export class Force {
    simulation: any;

    constructor(select: string, private nodes?: Array<NodeModel>, private links?: Array<d3.SimulationLinkDatum<d3.SimulationNodeDatum>>) {
        let covNodes: { [key: string]: any; } = {};
        this.nodes = [];
        this.links = _.clone(defaultLinks);

        _.each(this.links, (link) => {
            link.source = covNodes[link.source as string] || (covNodes[link.source as string] = { title: link.source });
            link.target = covNodes[link.target as string] || (covNodes[link.target as string] = { title: link.target });
        });

        this.nodes = d3.values(covNodes);
        var width = innerWidth,
            height = innerHeight;

        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links || []).distance(60))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        d3.select(select).select("*").remove();
        var svg = d3.select(select)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

        svg.append("defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("marker")
            .attr("id", function (d) { return d; })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var path = svg.append("g").selectAll("path")
            .data(this.links)
            .enter()
            .append("path")
            .attr("class", function (d: d3.SimulationNodeDatum) {
                return "link " + d["type"];
            })
            .attr("marker-end", function (d: d3.SimulationNodeDatum) {
                return "url(#" + d['type'] + ")";
            });
        var circle = svg.append("g").selectAll("circle")
            .data(this.nodes)
            .enter().append("circle")
            .attr("r", 6)
            .call((d3.drag()
                .on("start", (d: d3.SimulationNodeDatum) => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0.5).restart();
                    }
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (d: d3.SimulationNodeDatum) => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                })
                .on("end", (d: d3.SimulationNodeDatum) => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0);
                    }
                    d.fx = null;
                    d.fy = null;
                }) as any));
        var text = svg.append("g").selectAll("text")
            .data(this.nodes)
            .enter().append("text")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function (d: NodeModel) { return d.title; });

        svg.selectAll("g").attr("width", width).attr("height", height);
        this.simulation.nodes(this.nodes)
            .force("link", d3.forceLink(this.links))
            .on("tick", tick);


        function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            text.attr("transform", transform);
        }

        function linkArc(d) {
            if (d.target.x === undefined)
                return;

            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
    }
}



export class Force1 {
    svg: d3.Selection<d3.BaseType, any, any, any>;
    svgNodes: d3.Selection<d3.BaseType, any, any, any>;
    svgEdges: d3.Selection<d3.BaseType, any, any, any>;
    svgTexts: d3.Selection<d3.BaseType, any, any, any>;
    simulation: any;
    zoom: d3.ZoomBehavior<d3.ZoomedElementBaseType, any>;

    constructor(select: string, private nodes?: Array<{ title: string, fixed?: boolean, fx?: any, fy?: any }>, private links?: Array<{ source: number, target: number }>) {
        const defaultNodes = [
            { title: "桂林" }, { title: "广州" },
            { title: "厦门" }, { title: "杭州" },
            { title: "上海" }, { title: "青岛" },
            { title: "天津" }
        ];
        const defaultLinks = [{ source: 2, target: 4 }];

        this.nodes = this.nodes || defaultNodes;
        this.links = this.links || defaultLinks;

        _.each(this.nodes, (node, index) => {
            node.fy = null;
            node.fx = null;
            this.links.push({ source: 0, target: index + 1 });
        });
        this.nodes.unshift({ title: "Ἀσάνα" });
        this.svg = d3.select(select);
        this.svg.select("*").remove();
        this.svg = this.svg.append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
        this.doDraw();
    }

    doZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .duration(400)
            .on("zoom", () => {
                this.svg.select(".nodes").attr("transform", d3.event.transform);
                this.svg.select(".texts").attr("transform", d3.event.transform);
                this.svg.select(".lines").attr("transform", d3.event.transform);
            });
        this.svg.call(this.zoom);
    }

    doDrawNodes() {
        this.svgEdges = this.svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", 100)
            .attr("cy", 100)
            .style("fill", "black")
            .call((d3.drag()
                .on("start", (d: d3.SimulationNodeDatum) => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0.5).restart();
                    }
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (d: d3.SimulationNodeDatum) => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                })
                .on("end", (d: d3.SimulationNodeDatum) => {
                    if (!d3.event.active) {
                        this.simulation.alphaTarget(0);
                    }
                    d.fx = null;
                    d.fy = null;
                }) as any));



        return this.svgEdges;
    }

    doDrawEdges() {
        this.svgEdges = this.svg.append("g")
            .attr("class", "lines")
            .selectAll("line")
            .data(this.links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        return this.svgEdges;
    }

    doDrawTexts() {
        this.svgTexts = this.svg.append("g")
            .attr("class", "texts")
            .selectAll("text")
            .data(this.nodes)
            .enter()
            .append("text")
            .style("fill", "black")
            .attr("dx", 20)
            .attr("dy", 8)
            .text(function (d) {
                return d.title;
            });

        this.svgTexts.append("title")
            .text(function (d) { return d.title; });
        this.svgTexts.append("text")
            .attr("dy", ".3em")
            .attr("class", "nodetext")
            .style("text-anchor", "middle")
            .text(function (d) { return d.title; });

        return this.svgTexts;
    }

    doDraw() {
        let width = innerWidth,
            height = innerHeight;

        this.doZoom();
        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links))
            .force("charge", d3.forceManyBody().strength(-5000).theta(200).distanceMin(200))
            .force("center", d3.forceCenter(width / 3, height / 2));

        let edges = this.doDrawEdges();
        let texts = this.doDrawTexts();
        let nodes = this.doDrawNodes();

        this.simulation.nodes(this.nodes)
            .on("tick", tick)
            .force("link");

        function tick() {
            edges && edges
                .attr("x1", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.source as d3.SimulationNodeDatum).x || 0;
                })
                .attr("y1", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.source as d3.SimulationNodeDatum).y || 0;
                })
                .attr("x2", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.target as d3.SimulationNodeDatum).x || 0;
                })
                .attr("y2", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.target as d3.SimulationNodeDatum).y || 0;
                });
            nodes && nodes.attr("cx", function (datum: d3.SimulationNodeDatum) {
                return datum.x || 0;
            }).attr("cy", function (datum: d3.SimulationNodeDatum) {
                return datum.y || 0;
            });
            texts && texts.attr("x", function (d: d3.SimulationNodeDatum) {
                return d.x || 0;
            }).attr("y", function (d: d3.SimulationNodeDatum) {
                return d.y || 0;
            });
        }
    }
}
export class Force2 {
    container: d3.Selection<d3.BaseType, any, any, any>;
    cardContainer: d3.Selection<d3.BaseType, any, any, any>;
    svgEdges: d3.Selection<d3.BaseType, any, any, any>;
    dragLine: d3.Selection<d3.BaseType, any, any, any>;
    currentNode: d3.SimulationNodeDatum;
    simulation: any;
    zoom: d3.ZoomBehavior<d3.ZoomedElementBaseType, any>;

    constructor(select: string, private nodes?: Array<NodeModel>, private links?: Array<d3.SimulationLinkDatum<d3.SimulationNodeDatum>>) {
        const defaultLinks = [{ source: 2, target: 4 }, { source: 2, target: 5 }, { source: 2, target: 3 }];

        this.links = defaultLinks;
        this.container = d3.select(select);
        this.cardContainer = this.container.select(".card-container");
        this.doZoom();
        this.doDrawEdges();
        this.doDraw();
    }

    doZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 10])
            .duration(400)
            .on("zoom", () => {
                this.container.select(".card-container").style("transform", `scale(${d3.event.transform.k}) translate(${d3.event.transform.x}px,${d3.event.transform.y}px)`);
                // this.container.style("transform", d3.event.transform);
                this.container.select(".lines").attr("transform", d3.event.transform);

                // .style("transform", `scale(${d3.event.transform.k}) translate(${d3.event.transform.x}px,${d3.event.transform.y}px)`);;
            });
        this.container.call(this.zoom);
    }

    doDrawEdges() {
        this.svgEdges = this.cardContainer.append("svg")
            // .append("g")
            // .attr("width","100%")
            // .attr("height","100%")
            .attr("class", "lines")
            .selectAll("line")
            .data(this.links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);

        this.dragLine = this.cardContainer.select("svg")
            .append("line")
            .attr("class", "drag_line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0);
    }

    doDraw() {
        let width = innerWidth,
            height = innerHeight;

        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links || []))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("center", d3.forceCenter(width / 2, height / 2));

        this.container
            .on("mousemove", () => {
                this.currentNode && this.dragLine
                    .attr("x1", this.currentNode.x)
                    .attr("y1", this.currentNode.y)
                    .attr("x2", d3.event.layerX)
                    .attr("y2", d3.event.layerY)
                    .style("stroke", "#000")
                    .style("stroke-width", 1);

                return false;
            })
        this.cardContainer
            .selectAll(".card")
            .data(this.nodes)
            .enter();

        this.cardContainer
            .selectAll(".card")
            .on("mousedown", (d) => {
                this.currentNode = d;
            })
            .on("mouseup", () => {
                // this.currentNode = null;
            });
        // .call((d3.drag()
        //     .on("start", (d: d3.SimulationNodeDatum) => {
        //         if (!d3.event.active) {
        //             this.simulation.alphaTarget(0.5).restart();
        //         }
        //         d.fx = d.x;
        //         d.fy = d.y;
        //     })
        //     .on("drag", (d: d3.SimulationNodeDatum) => {
        //         d.fx = d3.event.x;
        //         d.fy = d3.event.y;
        //     })
        //     .on("end", (d: d3.SimulationNodeDatum) => {
        //         if (!d3.event.active) {
        //             this.simulation.alphaTarget(0);
        //         }
        //         d.fx = null;
        //         d.fy = null;
        //     }) as any));

        this.simulation.nodes(this.nodes)
            .force("link", d3.forceLink(this.links))
            .on("tick", ticked)
            .force("link");

        let container = this.cardContainer;
        let edges = this.svgEdges;

        function ticked() {
            edges
                .attr("x1", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return ((d.source as d3.SimulationNodeDatum).x || 0);
                })
                .attr("y1", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.source as d3.SimulationNodeDatum).y || 0;
                })
                .attr("x2", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return (d.target as d3.SimulationNodeDatum).x || 0;
                })
                .attr("y2", function (d: d3.SimulationLinkDatum<d3.SimulationNodeDatum>) {
                    return ((d.target as d3.SimulationNodeDatum).y || 0);
                });

            container.selectAll(".card").style("left", function (d: d3.SimulationNodeDatum) {
                return `${d.x || 0}px`;
            }).style("top", function (d: d3.SimulationNodeDatum) {
                return `${d.y || 0}px`;
            });
        }
    }
}