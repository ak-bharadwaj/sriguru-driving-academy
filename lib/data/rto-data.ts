export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface RoadSignItem {
  name: string;
  category: string;
  meaning: string;
  rule: string;
  imagePath: string;
  signKey: string;
  fallbackShape?: string;
  fallbackColor?: string;
  steps?: string[];
}

export const ROAD_SIGNS_DATA: RoadSignItem[] = [
  { name: "Stop", category: "Signs", meaning: "This sign indicates: Stop.", rule: "You must follow the rule for: Stop.", imagePath: "/images/signs/mandatory/indian-road-sign-i-i-1-(en).svg", signKey: "stop" },
  { name: "Give Way", category: "Signs", meaning: "This sign indicates: Give Way.", rule: "You must follow the rule for: Give Way.", imagePath: "/images/signs/mandatory/indian-road-sign-i-i-2.svg", signKey: "give_way" },
  { name: "Give Way to Buses (Exiting the Bus Bay)", category: "Signs", meaning: "This sign indicates: Give Way to Buses (Exiting the Bus Bay).", rule: "You must follow the rule for: Give Way to Buses (Exiting the Bus Bay).", imagePath: "/images/signs/mandatory/give-way-to-buses.svg", signKey: "give_way_to_buses__exiting_the_bus_bay_" },
  { name: "No entry", category: "Signs", meaning: "This sign indicates: No entry.", rule: "You must follow the rule for: No entry.", imagePath: "/images/signs/mandatory/no-entry-sign-india.svg", signKey: "no_entry" },
  { name: "Priority for oncoming vehicles", category: "Signs", meaning: "This sign indicates: Priority for oncoming vehicles.", rule: "You must follow the rule for: Priority for oncoming vehicles.", imagePath: "/images/signs/mandatory/indian-road-sign-oncoming-priority.svg", signKey: "priority_for_oncoming_vehicles" },
  { name: "One-way traffic", category: "Signs", meaning: "This sign indicates: One-way traffic.", rule: "You must follow the rule for: One-way traffic.", imagePath: "/images/signs/mandatory/indian-road-sign-one-way-traffic-right.svg", signKey: "one_way_traffic" },
  { name: "One-way traffic", category: "Signs", meaning: "This sign indicates: One-way traffic.", rule: "You must follow the rule for: One-way traffic.", imagePath: "/images/signs/mandatory/indian-road-sign-one-way-traffic-left.svg", signKey: "one_way_traffic" },
  { name: "No vehicles in both directions", category: "Signs", meaning: "This sign indicates: No vehicles in both directions.", rule: "You must follow the rule for: No vehicles in both directions.", imagePath: "/images/signs/mandatory/indian-road-sign-no-vehicles.svg", signKey: "no_vehicles_in_both_directions" },
  { name: "Cycles prohibited", category: "Signs", meaning: "This sign indicates: Cycles prohibited.", rule: "You must follow the rule for: Cycles prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-14.svg", signKey: "cycles_prohibited" },
  { name: "Trucks prohibited", category: "Signs", meaning: "This sign indicates: Trucks prohibited.", rule: "You must follow the rule for: Trucks prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-9.svg", signKey: "trucks_prohibited" },
  { name: "Pedestrians prohibited", category: "Signs", meaning: "This sign indicates: Pedestrians prohibited.", rule: "You must follow the rule for: Pedestrians prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-pedestrians-prohibited.svg", signKey: "pedestrians_prohibited" },
  { name: "Tongas prohibited", category: "Signs", meaning: "This sign indicates: Tongas prohibited.", rule: "You must follow the rule for: Tongas prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-4.svg", signKey: "tongas_prohibited" },
  { name: "Bullock carts prohibited", category: "Signs", meaning: "This sign indicates: Bullock carts prohibited.", rule: "You must follow the rule for: Bullock carts prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-1.svg", signKey: "bullock_carts_prohibited" },
  { name: "Hand carts prohibited", category: "Signs", meaning: "This sign indicates: Hand carts prohibited.", rule: "You must follow the rule for: Hand carts prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-3.svg", signKey: "hand_carts_prohibited" },
  { name: "Bullock cart and hand carts prohibited", category: "Signs", meaning: "This sign indicates: Bullock cart and hand carts prohibited.", rule: "You must follow the rule for: Bullock cart and hand carts prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-2.svg", signKey: "bullock_cart_and_hand_carts_prohibited" },
  { name: "All motor vehicles prohibited", category: "Signs", meaning: "This sign indicates: All motor vehicles prohibited.", rule: "You must follow the rule for: All motor vehicles prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-all-motor-vehicles-prohibited.svg", signKey: "all_motor_vehicles_prohibited" },
  { name: "Buses Prohibited", category: "Signs", meaning: "This sign indicates: Buses Prohibited.", rule: "You must follow the rule for: Buses Prohibited.", imagePath: "/images/signs/mandatory/buses-prohibited.svg", signKey: "buses_prohibited" },
  { name: "Height limit", category: "Laws", meaning: "This sign indicates: Height limit.", rule: "You must follow the rule for: Height limit.", imagePath: "/images/signs/mandatory/indian-road-sign-i-iv-2.svg", signKey: "height_limit" },
  { name: "Width limit", category: "Laws", meaning: "This sign indicates: Width limit.", rule: "You must follow the rule for: Width limit.", imagePath: "/images/signs/mandatory/indian-road-sign-width-limit.svg", signKey: "width_limit" },
  { name: "Load limit", category: "Laws", meaning: "This sign indicates: Load limit.", rule: "You must follow the rule for: Load limit.", imagePath: "/images/signs/mandatory/indian-road-sign-i-iv-4.svg", signKey: "load_limit" },
  { name: "Axle load limit", category: "Laws", meaning: "This sign indicates: Axle load limit.", rule: "You must follow the rule for: Axle load limit.", imagePath: "/images/signs/mandatory/indian-road-sign-i-iv-1.svg", signKey: "axle_load_limit" },
  { name: "Length limit", category: "Laws", meaning: "This sign indicates: Length limit.", rule: "You must follow the rule for: Length limit.", imagePath: "/images/signs/mandatory/indian-road-sign-i-iv-3.svg", signKey: "length_limit" },
  { name: "Left turn prohibited", category: "Signs", meaning: "This sign indicates: Left turn prohibited.", rule: "You must follow the rule for: Left turn prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-18.svg", signKey: "left_turn_prohibited" },
  { name: "Right turn prohibited", category: "Signs", meaning: "This sign indicates: Right turn prohibited.", rule: "You must follow the rule for: Right turn prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-19.svg", signKey: "right_turn_prohibited" },
  { name: "Overtaking prohibited", category: "Signs", meaning: "This sign indicates: Overtaking prohibited.", rule: "You must follow the rule for: Overtaking prohibited.", imagePath: "/images/signs/mandatory/overtaking-prohibited.svg", signKey: "overtaking_prohibited" },
  { name: "U-Turn Prohibited", category: "Signs", meaning: "This sign indicates: U-Turn Prohibited.", rule: "You must follow the rule for: U-Turn Prohibited.", imagePath: "/images/signs/mandatory/u-turn-prohibited.svg", signKey: "u_turn_prohibited" },
  { name: "Maximum Speed Limit", category: "Laws", meaning: "This sign indicates: Maximum Speed Limit.", rule: "You must follow the rule for: Maximum Speed Limit.", imagePath: "/images/signs/mandatory/indian-road-sign-i-iv-6.svg", signKey: "maximum_speed_limit" },
  { name: "Stop For Police Check", category: "Signs", meaning: "This sign indicates: Stop For Police Check.", rule: "You must follow the rule for: Stop For Police Check.", imagePath: "/images/signs/mandatory/stop-for-police-check.svg", signKey: "stop_for_police_check" },
  { name: "Horns prohibited", category: "Signs", meaning: "This sign indicates: Horns prohibited.", rule: "You must follow the rule for: Horns prohibited.", imagePath: "/images/signs/mandatory/indian-road-sign-i-ii-15.svg", signKey: "horns_prohibited" },
  { name: "Restriction Ends", category: "Signs", meaning: "This sign indicates: Restriction Ends.", rule: "You must follow the rule for: Restriction Ends.", imagePath: "/images/signs/information/restriction-ends-sign-india.svg", signKey: "restriction_ends" },
  { name: "No Parking", category: "Parking", meaning: "This sign indicates: No Parking.", rule: "You must follow the rule for: No Parking.", imagePath: "/images/signs/mandatory/no-parking-new.svg", signKey: "no_parking" },
  { name: "No Standing", category: "Signs", meaning: "This sign indicates: No Standing.", rule: "You must follow the rule for: No Standing.", imagePath: "/images/signs/mandatory/no-standing.svg", signKey: "no_standing" },
  { name: "No Stopping", category: "Signs", meaning: "This sign indicates: No Stopping.", rule: "You must follow the rule for: No Stopping.", imagePath: "/images/signs/mandatory/no-stopping.svg", signKey: "no_stopping" },
  { name: "Parking Not Allowed On Footpath", category: "Parking", meaning: "This sign indicates: Parking Not Allowed On Footpath.", rule: "You must follow the rule for: Parking Not Allowed On Footpath.", imagePath: "/images/signs/mandatory/parking-not-allowed-on-footpath.svg", signKey: "parking_not_allowed_on_footpath" },
  { name: "Parking Not Allowed On Half of Footpath", category: "Parking", meaning: "This sign indicates: Parking Not Allowed On Half of Footpath.", rule: "You must follow the rule for: Parking Not Allowed On Half of Footpath.", imagePath: "/images/signs/mandatory/parking-not-allowed-on-half-of-footpath.svg", signKey: "parking_not_allowed_on_half_of_footpath" },
  { name: "Compulsory Ahead", category: "Signs", meaning: "This sign indicates: Compulsory Ahead.", rule: "You must follow the rule for: Compulsory Ahead.", imagePath: "/images/signs/mandatory/compulsory-ahead.svg", signKey: "compulsory_ahead" },
  { name: "Compulsory Turn Left", category: "Signs", meaning: "This sign indicates: Compulsory Turn Left.", rule: "You must follow the rule for: Compulsory Turn Left.", imagePath: "/images/signs/mandatory/compulsory-left-india.svg", signKey: "compulsory_turn_left" },
  { name: "Compulsory Turn Right", category: "Signs", meaning: "This sign indicates: Compulsory Turn Right.", rule: "You must follow the rule for: Compulsory Turn Right.", imagePath: "/images/signs/mandatory/compulsory-right-india.svg", signKey: "compulsory_turn_right" },
  { name: "Compulsory turn left (In advance of a Junction)", category: "Signs", meaning: "This sign indicates: Compulsory turn left (In advance of a Junction).", rule: "You must follow the rule for: Compulsory turn left (In advance of a Junction).", imagePath: "/images/signs/mandatory/compulsory-left-ahead-india.svg", signKey: "compulsory_turn_left__in_advance_of_a_junction_" },
  { name: "Compulsory turn right (In advance of a Junction)", category: "Signs", meaning: "This sign indicates: Compulsory turn right (In advance of a Junction).", rule: "You must follow the rule for: Compulsory turn right (In advance of a Junction).", imagePath: "/images/signs/mandatory/compulsory-right-ahead-india.svg", signKey: "compulsory_turn_right__in_advance_of_a_junction_" },
  { name: "Compulsory Ahead or turn Right", category: "Signs", meaning: "This sign indicates: Compulsory Ahead or turn Right.", rule: "You must follow the rule for: Compulsory Ahead or turn Right.", imagePath: "/images/signs/mandatory/compulsory-ahead-or-right-india.svg", signKey: "compulsory_ahead_or_turn_right" },
  { name: "Compulsory Ahead or turn Left", category: "Signs", meaning: "This sign indicates: Compulsory Ahead or turn Left.", rule: "You must follow the rule for: Compulsory Ahead or turn Left.", imagePath: "/images/signs/mandatory/compulsory-ahead-or-left-india.svg", signKey: "compulsory_ahead_or_turn_left" },
  { name: "Compulsory Keep Left", category: "Signs", meaning: "This sign indicates: Compulsory Keep Left.", rule: "You must follow the rule for: Compulsory Keep Left.", imagePath: "/images/signs/mandatory/compulsory-keep-left-india.svg", signKey: "compulsory_keep_left" },
  { name: "Compulsory Keep Right", category: "Signs", meaning: "This sign indicates: Compulsory Keep Right.", rule: "You must follow the rule for: Compulsory Keep Right.", imagePath: "/images/signs/mandatory/compulsory-keep-right-india.svg", signKey: "compulsory_keep_right" },
  { name: "Pass Either Side", category: "Signs", meaning: "This sign indicates: Pass Either Side.", rule: "You must follow the rule for: Pass Either Side.", imagePath: "/images/signs/mandatory/pass-either-side-india.svg", signKey: "pass_either_side" },
  { name: "Mini Roundabout", category: "Signs", meaning: "This sign indicates: Mini Roundabout.", rule: "You must follow the rule for: Mini Roundabout.", imagePath: "/images/signs/mandatory/priority-to-vehicles-from-the-right-india.svg", signKey: "mini_roundabout" },
  { name: "Compulsory Cycle track/Cycle Only", category: "Signs", meaning: "This sign indicates: Compulsory Cycle track/Cycle Only.", rule: "You must follow the rule for: Compulsory Cycle track/Cycle Only.", imagePath: "/images/signs/mandatory/compulsory-cycle-track-india.svg", signKey: "compulsory_cycle_track_cycle_only" },
  { name: "Compulsory Cyclist and Pedestrian Route", category: "Signs", meaning: "This sign indicates: Compulsory Cyclist and Pedestrian Route.", rule: "You must follow the rule for: Compulsory Cyclist and Pedestrian Route.", imagePath: "/images/signs/mandatory/compulsory-cyclist-and-pedestrian-route-india.svg", signKey: "compulsory_cyclist_and_pedestrian_route" },
  { name: "Pedestrian Only", category: "Signs", meaning: "This sign indicates: Pedestrian Only.", rule: "You must follow the rule for: Pedestrian Only.", imagePath: "/images/signs/mandatory/pedestrian-only-india.svg", signKey: "pedestrian_only" },
  { name: "Bus Way/Buses Only", category: "Signs", meaning: "This sign indicates: Bus Way/Buses Only.", rule: "You must follow the rule for: Bus Way/Buses Only.", imagePath: "/images/signs/mandatory/bus-way-sign-india.svg", signKey: "bus_way_buses_only" },
  { name: "Compulsory Snow Chain", category: "Signs", meaning: "This sign indicates: Compulsory Snow Chain.", rule: "You must follow the rule for: Compulsory Snow Chain.", imagePath: "/images/signs/mandatory/compulsory-snow-chain-india.svg", signKey: "compulsory_snow_chain" },
  { name: "Compulsory Sound Horn", category: "Signs", meaning: "This sign indicates: Compulsory Sound Horn.", rule: "You must follow the rule for: Compulsory Sound Horn.", imagePath: "/images/signs/mandatory/compulsory-sound-horn-india.svg", signKey: "compulsory_sound_horn" },
  { name: "Minimum Speed Limit", category: "Laws", meaning: "This sign indicates: Minimum Speed Limit.", rule: "You must follow the rule for: Minimum Speed Limit.", imagePath: "/images/signs/mandatory/minimum-speed-limit-india.svg", signKey: "minimum_speed_limit" },
  { name: "Left curve", category: "Signs", meaning: "This sign indicates: Left curve.", rule: "You must follow the rule for: Left curve.", imagePath: "/images/signs/warning/indian-road-sign-ii-1.svg", signKey: "left_curve" },
  { name: "Right curve", category: "Signs", meaning: "This sign indicates: Right curve.", rule: "You must follow the rule for: Right curve.", imagePath: "/images/signs/warning/indian-road-sign-ii-2.svg", signKey: "right_curve" },
  { name: "Right hairpin bend", category: "Signs", meaning: "This sign indicates: Right hairpin bend.", rule: "You must follow the rule for: Right hairpin bend.", imagePath: "/images/signs/warning/indian-road-sign-ii-3.svg", signKey: "right_hairpin_bend" },
  { name: "Left hairpin bend", category: "Signs", meaning: "This sign indicates: Left hairpin bend.", rule: "You must follow the rule for: Left hairpin bend.", imagePath: "/images/signs/warning/indian-road-sign-ii-4.svg", signKey: "left_hairpin_bend" },
  { name: "Right reverse bend", category: "Signs", meaning: "This sign indicates: Right reverse bend.", rule: "You must follow the rule for: Right reverse bend.", imagePath: "/images/signs/warning/indian-road-sign-ii-5.svg", signKey: "right_reverse_bend" },
  { name: "Left reverse bend", category: "Signs", meaning: "This sign indicates: Left reverse bend.", rule: "You must follow the rule for: Left reverse bend.", imagePath: "/images/signs/warning/indian-road-sign-ii-6.svg", signKey: "left_reverse_bend" },
  { name: "Series of Bends", category: "Signs", meaning: "This sign indicates: Series of Bends.", rule: "You must follow the rule for: Series of Bends.", imagePath: "/images/signs/warning/indian-road-sign-ii-7.svg", signKey: "series_of_bends" },
  { name: "270 Degree Loop", category: "Signs", meaning: "This sign indicates: 270 Degree Loop.", rule: "You must follow the rule for: 270 Degree Loop.", imagePath: "/images/signs/warning/indian-road-sign-ii-8.svg", signKey: "270_degree_loop" },
  { name: "Side road to right", category: "Signs", meaning: "This sign indicates: Side road to right.", rule: "You must follow the rule for: Side road to right.", imagePath: "/images/signs/warning/indian-road-sign-ii-9.svg", signKey: "side_road_to_right" },
  { name: "Side road to left", category: "Signs", meaning: "This sign indicates: Side road to left.", rule: "You must follow the rule for: Side road to left.", imagePath: "/images/signs/warning/indian-road-sign-ii-10.svg", signKey: "side_road_to_left" },
  { name: "Y-Intersection (Left)", category: "Signs", meaning: "This sign indicates: Y-Intersection (Left).", rule: "You must follow the rule for: Y-Intersection (Left).", imagePath: "/images/signs/warning/indian-road-sign-ii-11a.svg", signKey: "y_intersection__left_" },
  { name: "Y-Intersection (Right)", category: "Signs", meaning: "This sign indicates: Y-Intersection (Right).", rule: "You must follow the rule for: Y-Intersection (Right).", imagePath: "/images/signs/warning/indian-road-sign-ii-11b.svg", signKey: "y_intersection__right_" },
  { name: "Y-Intersection", category: "Signs", meaning: "This sign indicates: Y-Intersection.", rule: "You must follow the rule for: Y-Intersection.", imagePath: "/images/signs/warning/y-intersection.svg", signKey: "y_intersection" },
  { name: "Crossroads", category: "Signs", meaning: "This sign indicates: Crossroads.", rule: "You must follow the rule for: Crossroads.", imagePath: "/images/signs/warning/indian-road-sign-ii-12.svg", signKey: "crossroads" },
  { name: "Roundabout", category: "Signs", meaning: "This sign indicates: Roundabout.", rule: "You must follow the rule for: Roundabout.", imagePath: "/images/signs/warning/indian-road-sign-ii-13.svg", signKey: "roundabout" },
  { name: "Traffic Signals", category: "Signs", meaning: "This sign indicates: Traffic Signals.", rule: "You must follow the rule for: Traffic Signals.", imagePath: "/images/signs/warning/indian-road-sign-ii-14.svg", signKey: "traffic_signals" },
  { name: "T-junction", category: "Signs", meaning: "This sign indicates: T-junction.", rule: "You must follow the rule for: T-junction.", imagePath: "/images/signs/warning/indian-road-sign-ii-15.svg", signKey: "t_junction" },
  { name: "T-junction major road ahead", category: "Signs", meaning: "This sign indicates: T-junction major road ahead.", rule: "You must follow the rule for: T-junction major road ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-16.svg", signKey: "t_junction_major_road_ahead" },
  { name: "Major road ahead", category: "Signs", meaning: "This sign indicates: Major road ahead.", rule: "You must follow the rule for: Major road ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-17.svg", signKey: "major_road_ahead" },
  { name: "Staggered junction", category: "Signs", meaning: "This sign indicates: Staggered junction.", rule: "You must follow the rule for: Staggered junction.", imagePath: "/images/signs/warning/indian-road-sign-ii-18-l-r.svg", signKey: "staggered_junction" },
  { name: "Staggered junction", category: "Signs", meaning: "This sign indicates: Staggered junction.", rule: "You must follow the rule for: Staggered junction.", imagePath: "/images/signs/warning/indian-road-sign-ii-18-r-l.svg", signKey: "staggered_junction" },
  { name: "Merging Traffic ahead from Right", category: "Signs", meaning: "This sign indicates: Merging Traffic ahead from Right.", rule: "You must follow the rule for: Merging Traffic ahead from Right.", imagePath: "/images/signs/warning/indian-road-sign-ii-19-r.svg", signKey: "merging_traffic_ahead_from_right" },
  { name: "Merging Traffic ahead from Left", category: "Signs", meaning: "This sign indicates: Merging Traffic ahead from Left.", rule: "You must follow the rule for: Merging Traffic ahead from Left.", imagePath: "/images/signs/warning/indian-road-sign-ii-19.svg", signKey: "merging_traffic_ahead_from_left" },
  { name: "Road Narrows Ahead", category: "Signs", meaning: "This sign indicates: Road Narrows Ahead.", rule: "You must follow the rule for: Road Narrows Ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-21.svg", signKey: "road_narrows_ahead" },
  { name: "Road widens", category: "Signs", meaning: "This sign indicates: Road widens.", rule: "You must follow the rule for: Road widens.", imagePath: "/images/signs/warning/indian-road-sign-ii-22.svg", signKey: "road_widens" },
  { name: "Narrow Bridge Ahead", category: "Signs", meaning: "This sign indicates: Narrow Bridge Ahead.", rule: "You must follow the rule for: Narrow Bridge Ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-23.svg", signKey: "narrow_bridge_ahead" },
  { name: "Steep ascent", category: "Signs", meaning: "This sign indicates: Steep ascent.", rule: "You must follow the rule for: Steep ascent.", imagePath: "/images/signs/warning/indian-road-sign-ii-24.svg", signKey: "steep_ascent" },
  { name: "Steep descent", category: "Signs", meaning: "This sign indicates: Steep descent.", rule: "You must follow the rule for: Steep descent.", imagePath: "/images/signs/warning/indian-road-sign-ii-25.svg", signKey: "steep_descent" },
  { name: "Reduced Carriageway Left Lane(s) Reduced", category: "Signs", meaning: "This sign indicates: Reduced Carriageway Left Lane(s) Reduced.", rule: "You must follow the rule for: Reduced Carriageway Left Lane(s) Reduced.", imagePath: "/images/signs/warning/indian-road-sign-ii-26.svg", signKey: "reduced_carriageway_left_lane_s__reduced" },
  { name: "Reduced Carriageway Right Lane(s) Reduced", category: "Signs", meaning: "This sign indicates: Reduced Carriageway Right Lane(s) Reduced.", rule: "You must follow the rule for: Reduced Carriageway Right Lane(s) Reduced.", imagePath: "/images/signs/warning/indian-road-sign-ii-27.svg", signKey: "reduced_carriageway_right_lane_s__reduced" },
  { name: "Start of dual carriageway", category: "Signs", meaning: "This sign indicates: Start of dual carriageway.", rule: "You must follow the rule for: Start of dual carriageway.", imagePath: "/images/signs/warning/indian-road-sign-ii-28.svg", signKey: "start_of_dual_carriageway" },
  { name: "End of dual carriageway", category: "Signs", meaning: "This sign indicates: End of dual carriageway.", rule: "You must follow the rule for: End of dual carriageway.", imagePath: "/images/signs/warning/indian-road-sign-ii-29.svg", signKey: "end_of_dual_carriageway" },
  { name: "Gap in median", category: "Signs", meaning: "This sign indicates: Gap in median.", rule: "You must follow the rule for: Gap in median.", imagePath: "/images/signs/warning/indian-road-sign-ii-30.svg", signKey: "gap_in_median" },
  { name: "Pedestrian crossing", category: "Signs", meaning: "This sign indicates: Pedestrian crossing.", rule: "You must follow the rule for: Pedestrian crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-31.svg", signKey: "pedestrian_crossing" },
  { name: "School Ahead", category: "Signs", meaning: "This sign indicates: School Ahead.", rule: "You must follow the rule for: School Ahead.", imagePath: "/images/signs/warning/road-sign-children.svg", signKey: "school_ahead" },
  { name: "Built-up area", category: "Signs", meaning: "This sign indicates: Built-up area.", rule: "You must follow the rule for: Built-up area.", imagePath: "/images/signs/warning/indian-road-sign-ii-33.svg", signKey: "built_up_area" },
  { name: "Two Way Operation", category: "Signs", meaning: "This sign indicates: Two Way Operation.", rule: "You must follow the rule for: Two Way Operation.", imagePath: "/images/signs/warning/two-way-operation.svg", signKey: "two_way_operation" },
  { name: "Two way Traffic on crossroads Ahead Warning", category: "Emergencies", meaning: "This sign indicates: Two way Traffic on crossroads Ahead Warning.", rule: "You must follow the rule for: Two way Traffic on crossroads Ahead Warning.", imagePath: "/images/signs/warning/two-way-traffic-on-crossroad-ahead-warning.svg", signKey: "two_way_traffic_on_crossroads_ahead_warning" },
  { name: "People At Work", category: "Signs", meaning: "This sign indicates: People At Work.", rule: "You must follow the rule for: People At Work.", imagePath: "/images/signs/warning/roadworks-2022.svg", signKey: "people_at_work" },
  { name: "Supplementary plate ''END'' at the leaving side of work zone", category: "Signs", meaning: "This sign indicates: Supplementary plate ''END'' at the leaving side of work zone.", rule: "You must follow the rule for: Supplementary plate ''END'' at the leaving side of work zone.", imagePath: "/images/signs/warning/indian-road-sign-ii-41.svg", signKey: "supplementary_plate___end___at_the_leaving_side_of_work_zone" },
  { name: "Danger warning", category: "Emergencies", meaning: "This sign indicates: Danger warning.", rule: "You must follow the rule for: Danger warning.", imagePath: "/images/signs/warning/indian-road-sign-ii-42.svg", signKey: "danger_warning" },
  { name: "Differently Abled Persons Ahead", category: "Signs", meaning: "This sign indicates: Differently Abled Persons Ahead.", rule: "You must follow the rule for: Differently Abled Persons Ahead.", imagePath: "/images/signs/warning/differently-abled-persons-ahead.svg", signKey: "differently_abled_persons_ahead" },
  { name: "Deaf Persons Ahead", category: "Signs", meaning: "This sign indicates: Deaf Persons Ahead.", rule: "You must follow the rule for: Deaf Persons Ahead.", imagePath: "/images/signs/warning/deaf-persons-ahead.svg", signKey: "deaf_persons_ahead" },
  { name: "Blind Persons Ahead", category: "Signs", meaning: "This sign indicates: Blind Persons Ahead.", rule: "You must follow the rule for: Blind Persons Ahead.", imagePath: "/images/signs/warning/blind-persons-ahead.svg", signKey: "blind_persons_ahead" },
  { name: "Cycle crossing", category: "Signs", meaning: "This sign indicates: Cycle crossing.", rule: "You must follow the rule for: Cycle crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-45.svg", signKey: "cycle_crossing" },
  { name: "Cycle Route Ahead", category: "Signs", meaning: "This sign indicates: Cycle Route Ahead.", rule: "You must follow the rule for: Cycle Route Ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-46.svg", signKey: "cycle_route_ahead" },
  { name: "Dangerous Dip", category: "Emergencies", meaning: "This sign indicates: Dangerous Dip.", rule: "You must follow the rule for: Dangerous Dip.", imagePath: "/images/signs/warning/indian-road-sign-ii-47.svg", signKey: "dangerous_dip" },
  { name: "Speed Breaker", category: "Laws", meaning: "This sign indicates: Speed Breaker.", rule: "You must follow the rule for: Speed Breaker.", imagePath: "/images/signs/warning/indian-road-sign-ii-48.svg", signKey: "speed_breaker" },
  { name: "Rumble strip", category: "Signs", meaning: "This sign indicates: Rumble strip.", rule: "You must follow the rule for: Rumble strip.", imagePath: "/images/signs/warning/indian-road-sign-ii-49.svg", signKey: "rumble_strip" },
  { name: "Rough road", category: "Signs", meaning: "This sign indicates: Rough road.", rule: "You must follow the rule for: Rough road.", imagePath: "/images/signs/warning/indian-road-sign-ii-50.svg", signKey: "rough_road" },
  { name: "Soft verges", category: "Signs", meaning: "This sign indicates: Soft verges.", rule: "You must follow the rule for: Soft verges.", imagePath: "/images/signs/warning/indian-road-sign-ii-51.svg", signKey: "soft_verges" },
  { name: "Loose gravel", category: "Signs", meaning: "This sign indicates: Loose gravel.", rule: "You must follow the rule for: Loose gravel.", imagePath: "/images/signs/warning/indian-road-sign-ii-52.svg", signKey: "loose_gravel" },
  { name: "Slippery road", category: "Signs", meaning: "This sign indicates: Slippery road.", rule: "You must follow the rule for: Slippery road.", imagePath: "/images/signs/warning/indian-road-sign-ii-53.svg", signKey: "slippery_road" },
  { name: "Slippery road because of Ice", category: "Signs", meaning: "This sign indicates: Slippery road because of Ice.", rule: "You must follow the rule for: Slippery road because of Ice.", imagePath: "/images/signs/warning/indian-road-sign-ii-54.svg", signKey: "slippery_road_because_of_ice" },
  { name: "Opening or Swing Bridge", category: "Signs", meaning: "This sign indicates: Opening or Swing Bridge.", rule: "You must follow the rule for: Opening or Swing Bridge.", imagePath: "/images/signs/warning/indian-road-sign-ii-55.svg", signKey: "opening_or_swing_bridge" },
  { name: "Overhead cables", category: "Signs", meaning: "This sign indicates: Overhead cables.", rule: "You must follow the rule for: Overhead cables.", imagePath: "/images/signs/warning/indian-road-sign-ii-56.svg", signKey: "overhead_cables" },
  { name: "Quayside or riverbank", category: "Signs", meaning: "This sign indicates: Quayside or riverbank.", rule: "You must follow the rule for: Quayside or riverbank.", imagePath: "/images/signs/warning/indian-road-sign-ii-58.svg", signKey: "quayside_or_riverbank" },
  { name: "Barrier", category: "Signs", meaning: "This sign indicates: Barrier.", rule: "You must follow the rule for: Barrier.", imagePath: "/images/signs/warning/indian-road-sign-ii-59.svg", signKey: "barrier" },
  { name: "Sudden Side Winds", category: "Signs", meaning: "This sign indicates: Sudden Side Winds.", rule: "You must follow the rule for: Sudden Side Winds.", imagePath: "/images/signs/warning/indian-road-sign-ii-60.svg", signKey: "sudden_side_winds" },
  { name: "Tunnel ahead", category: "Signs", meaning: "This sign indicates: Tunnel ahead.", rule: "You must follow the rule for: Tunnel ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-61.svg", signKey: "tunnel_ahead" },
  { name: "Ferry", category: "Signs", meaning: "This sign indicates: Ferry.", rule: "You must follow the rule for: Ferry.", imagePath: "/images/signs/warning/indian-road-sign-ii-62.svg", signKey: "ferry" },
  { name: "Trams crossing", category: "Signs", meaning: "This sign indicates: Trams crossing.", rule: "You must follow the rule for: Trams crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-63.svg", signKey: "trams_crossing" },
  { name: "Falling rocks", category: "Signs", meaning: "This sign indicates: Falling rocks.", rule: "You must follow the rule for: Falling rocks.", imagePath: "/images/signs/warning/indian-road-sign-ii-64.svg", signKey: "falling_rocks" },
  { name: "Cattle crossing", category: "Signs", meaning: "This sign indicates: Cattle crossing.", rule: "You must follow the rule for: Cattle crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-65.svg", signKey: "cattle_crossing" },
  { name: "Wild Animals", category: "Signs", meaning: "This sign indicates: Wild Animals.", rule: "You must follow the rule for: Wild Animals.", imagePath: "/images/signs/warning/indian-road-sign-ii-66.svg", signKey: "wild_animals" },
  { name: "Queues likely ahead", category: "Signs", meaning: "This sign indicates: Queues likely ahead.", rule: "You must follow the rule for: Queues likely ahead.", imagePath: "/images/signs/warning/indian-road-sign-ii-67.svg", signKey: "queues_likely_ahead" },
  { name: "Low-flying aircraft", category: "Signs", meaning: "This sign indicates: Low-flying aircraft.", rule: "You must follow the rule for: Low-flying aircraft.", imagePath: "/images/signs/warning/indian-road-sign-ii-68.svg", signKey: "low_flying_aircraft" },
  { name: "Unguarded railway crossing", category: "Signs", meaning: "This sign indicates: Unguarded railway crossing.", rule: "You must follow the rule for: Unguarded railway crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-69.svg", signKey: "unguarded_railway_crossing" },
  { name: "Unguarded railway crossing (50 - 100 Metres Ahead)", category: "Signs", meaning: "This sign indicates: Unguarded railway crossing (50 - 100 Metres Ahead).", rule: "You must follow the rule for: Unguarded railway crossing (50 - 100 Metres Ahead).", imagePath: "/images/signs/warning/unguarded-railway-crossing-100m-sign-india.svg", signKey: "unguarded_railway_crossing__50___100_metres_ahead_" },
  { name: "Unguarded railway crossing (200 metres ahead)", category: "Signs", meaning: "This sign indicates: Unguarded railway crossing (200 metres ahead).", rule: "You must follow the rule for: Unguarded railway crossing (200 metres ahead).", imagePath: "/images/signs/warning/unguarded-railway-crossing-200m-sign-india.svg", signKey: "unguarded_railway_crossing__200_metres_ahead_" },
  { name: "Guarded railway crossing", category: "Signs", meaning: "This sign indicates: Guarded railway crossing.", rule: "You must follow the rule for: Guarded railway crossing.", imagePath: "/images/signs/warning/indian-road-sign-ii-70.svg", signKey: "guarded_railway_crossing" },
  { name: "Guarded railway crossing (50-100 metres ahead)", category: "Signs", meaning: "This sign indicates: Guarded railway crossing (50-100 metres ahead).", rule: "You must follow the rule for: Guarded railway crossing (50-100 metres ahead).", imagePath: "/images/signs/warning/guarded-railway-crossing-100m-sign-india.svg", signKey: "guarded_railway_crossing__50_100_metres_ahead_" },
  { name: "Guarded railway crossing (200 metres ahead)", category: "Signs", meaning: "This sign indicates: Guarded railway crossing (200 metres ahead).", rule: "You must follow the rule for: Guarded railway crossing (200 metres ahead).", imagePath: "/images/signs/warning/guarded-railway-crossing-200m-sign-india.svg", signKey: "guarded_railway_crossing__200_metres_ahead_" },
  { name: "U-Turn Ahead", category: "Signs", meaning: "This sign indicates: U-Turn Ahead.", rule: "You must follow the rule for: U-Turn Ahead.", imagePath: "/images/signs/warning/u-turn-ahead.svg", signKey: "u_turn_ahead" },
  { name: "Single Chevron", category: "Signs", meaning: "This sign indicates: Single Chevron.", rule: "You must follow the rule for: Single Chevron.", imagePath: "/images/signs/information/single-chevron-normal-sign-india.svg", signKey: "single_chevron" },
  { name: "Double chevron", category: "Signs", meaning: "This sign indicates: Double chevron.", rule: "You must follow the rule for: Double chevron.", imagePath: "/images/signs/warning/indian-road-sign-ii-73.svg", signKey: "double_chevron" },
  { name: "Triple chevron", category: "Signs", meaning: "This sign indicates: Triple chevron.", rule: "You must follow the rule for: Triple chevron.", imagePath: "/images/signs/warning/indian-road-sign-ii-74.svg", signKey: "triple_chevron" },
  { name: "Object Hazard (Left)", category: "Emergencies", meaning: "This sign indicates: Object Hazard (Left).", rule: "You must follow the rule for: Object Hazard (Left).", imagePath: "/images/signs/warning/indian-road-sign-ii-75.svg", signKey: "object_hazard__left_" },
  { name: "Object Hazard (Right)", category: "Emergencies", meaning: "This sign indicates: Object Hazard (Right).", rule: "You must follow the rule for: Object Hazard (Right).", imagePath: "/images/signs/warning/indian-road-sign-ii-76.svg", signKey: "object_hazard__right_" },
  { name: "Two Way Object Hazard Marker", category: "Emergencies", meaning: "This sign indicates: Two Way Object Hazard Marker.", rule: "You must follow the rule for: Two Way Object Hazard Marker.", imagePath: "/images/signs/warning/indian-road-sign-ii-77.svg", signKey: "two_way_object_hazard_marker" },
  { name: "Expressway Ahead", category: "Signs", meaning: "This sign indicates: Expressway Ahead.", rule: "You must follow the rule for: Expressway Ahead.", imagePath: "/images/signs/information/expressway-ahead-sign-india.svg", signKey: "expressway_ahead" },
  { name: "Crash Prone Area", category: "Signs", meaning: "This sign indicates: Crash Prone Area.", rule: "You must follow the rule for: Crash Prone Area.", imagePath: "/images/signs/information/crash-prone-area.svg", signKey: "crash_prone_area" },
  { name: "Eating Place", category: "Signs", meaning: "This sign indicates: Eating Place.", rule: "You must follow the rule for: Eating Place.", imagePath: "/images/signs/information/eating-place-facility-sign-india.svg", signKey: "eating_place" },
  { name: "Light Refreshment", category: "Signs", meaning: "This sign indicates: Light Refreshment.", rule: "You must follow the rule for: Light Refreshment.", imagePath: "/images/signs/information/light-refreshment-facility-sign-india.svg", signKey: "light_refreshment" },
  { name: "Resting Place", category: "Signs", meaning: "This sign indicates: Resting Place.", rule: "You must follow the rule for: Resting Place.", imagePath: "/images/signs/information/resting-place-facility-sign-india.svg", signKey: "resting_place" },
  { name: "First Aid Post", category: "Signs", meaning: "This sign indicates: First Aid Post.", rule: "You must follow the rule for: First Aid Post.", imagePath: "/images/signs/information/first-aid-post-facility-sign-india.svg", signKey: "first_aid_post" },
  { name: "Toilet", category: "Signs", meaning: "This sign indicates: Toilet.", rule: "You must follow the rule for: Toilet.", imagePath: "/images/signs/information/toilet-facility-sign-india.svg", signKey: "toilet" },
  { name: "Filling Station (Fuel Pump)", category: "Signs", meaning: "This sign indicates: Filling Station (Fuel Pump).", rule: "You must follow the rule for: Filling Station (Fuel Pump).", imagePath: "/images/signs/information/filling-station-facility-sign-india.svg", signKey: "filling_station__fuel_pump_" },
  { name: "Hospital", category: "Signs", meaning: "This sign indicates: Hospital.", rule: "You must follow the rule for: Hospital.", imagePath: "/images/signs/information/hospital-sign-india.svg", signKey: "hospital" },
  { name: "Emergency SOS Facility", category: "Signs", meaning: "This sign indicates: Emergency SOS Facility.", rule: "You must follow the rule for: Emergency SOS Facility.", imagePath: "/images/signs/information/emergency-sos-facility-sign-india.svg", signKey: "emergency_sos_facility" },
  { name: "U-Turn Ahead", category: "Signs", meaning: "This sign indicates: U-Turn Ahead.", rule: "You must follow the rule for: U-Turn Ahead.", imagePath: "/images/signs/information/u-turn-ahead-facility-sign-india.svg", signKey: "u_turn_ahead" },
  { name: "Pedestrian Subway", category: "Signs", meaning: "This sign indicates: Pedestrian Subway.", rule: "You must follow the rule for: Pedestrian Subway.", imagePath: "/images/signs/information/pedestrian-subway-sign-india.svg", signKey: "pedestrian_subway" },
  { name: "Foot Over Bridge", category: "Signs", meaning: "This sign indicates: Foot Over Bridge.", rule: "You must follow the rule for: Foot Over Bridge.", imagePath: "/images/signs/information/foot-over-bridge-sign-india.svg", signKey: "foot_over_bridge" },
  { name: "Chair Lift", category: "Signs", meaning: "This sign indicates: Chair Lift.", rule: "You must follow the rule for: Chair Lift.", imagePath: "/images/signs/information/chair-lift-sign-india.svg", signKey: "chair_lift" },
  { name: "Police Station", category: "Signs", meaning: "This sign indicates: Police Station.", rule: "You must follow the rule for: Police Station.", imagePath: "/images/signs/information/police-station-sign-india.svg", signKey: "police_station" },
  { name: "Repair Facility", category: "Signs", meaning: "This sign indicates: Repair Facility.", rule: "You must follow the rule for: Repair Facility.", imagePath: "/images/signs/information/repair-facility-sign-india.svg", signKey: "repair_facility" },
  { name: "Railway Station/Metro Station/Monorail Station", category: "Signs", meaning: "This sign indicates: Railway Station/Metro Station/Monorail Station.", rule: "You must follow the rule for: Railway Station/Metro Station/Monorail Station.", imagePath: "/images/signs/information/railway-station-metro-station-monorail-station-sign-india.svg", signKey: "railway_station_metro_station_monorail_station" },
  { name: "Cycle Rickshaw Stand", category: "Signs", meaning: "This sign indicates: Cycle Rickshaw Stand.", rule: "You must follow the rule for: Cycle Rickshaw Stand.", imagePath: "/images/signs/information/cycle-rickshaw-stand-sign-india.svg", signKey: "cycle_rickshaw_stand" },
  { name: "Taxi Stand", category: "Signs", meaning: "This sign indicates: Taxi Stand.", rule: "You must follow the rule for: Taxi Stand.", imagePath: "/images/signs/information/taxi-stand-sign-india.svg", signKey: "taxi_stand" },
  { name: "Auto-rickshaw Stand", category: "Signs", meaning: "This sign indicates: Auto-rickshaw Stand.", rule: "You must follow the rule for: Auto-rickshaw Stand.", imagePath: "/images/signs/information/auto-rickshaw-stand-sign-india.svg", signKey: "auto_rickshaw_stand" },
  { name: "Shared Taxi/Share Auto Stand", category: "Signs", meaning: "This sign indicates: Shared Taxi/Share Auto Stand.", rule: "You must follow the rule for: Shared Taxi/Share Auto Stand.", imagePath: "/images/signs/information/shared-taxi-and-share-auto-stand-sign-india.svg", signKey: "shared_taxi_share_auto_stand" },
  { name: "Home Zone", category: "Signs", meaning: "This sign indicates: Home Zone.", rule: "You must follow the rule for: Home Zone.", imagePath: "/images/signs/information/home-zone-sign-india.svg", signKey: "home_zone" },
  { name: "Camp Site", category: "Signs", meaning: "This sign indicates: Camp Site.", rule: "You must follow the rule for: Camp Site.", imagePath: "/images/signs/information/camp-site-sign-india.svg", signKey: "camp_site" },
  { name: "Airport", category: "Signs", meaning: "This sign indicates: Airport.", rule: "You must follow the rule for: Airport.", imagePath: "/images/signs/information/airport-sign-india.svg", signKey: "airport" },
  { name: "Golf Course", category: "Signs", meaning: "This sign indicates: Golf Course.", rule: "You must follow the rule for: Golf Course.", imagePath: "/images/signs/information/golf-course-sign-india.svg", signKey: "golf_course" },
  { name: "National Heritage", category: "Signs", meaning: "This sign indicates: National Heritage.", rule: "You must follow the rule for: National Heritage.", imagePath: "/images/signs/information/national-heritage-sign-india.svg", signKey: "national_heritage" },
  { name: "No Through Road", category: "Signs", meaning: "This sign indicates: No Through Road.", rule: "You must follow the rule for: No Through Road.", imagePath: "/images/signs/information/no-through-road-sign-india.svg", signKey: "no_through_road" },
  { name: "No Through Side Road", category: "Signs", meaning: "This sign indicates: No Through Side Road.", rule: "You must follow the rule for: No Through Side Road.", imagePath: "/images/signs/information/no-through-side-road-sign-india.svg", signKey: "no_through_side_road" },
  { name: "Toll Road Ahead", category: "Signs", meaning: "This sign indicates: Toll Road Ahead.", rule: "You must follow the rule for: Toll Road Ahead.", imagePath: "/images/signs/information/toll-road-ahead-sign-india.svg", signKey: "toll_road_ahead" },
  { name: "ETC Lane Guide", category: "Signs", meaning: "This sign indicates: ETC Lane Guide.", rule: "You must follow the rule for: ETC Lane Guide.", imagePath: "/images/signs/information/guide-sign-on-etc-lane-sign-india.svg", signKey: "etc_lane_guide" },
  { name: "Country Border", category: "Signs", meaning: "This sign indicates: Country Border.", rule: "You must follow the rule for: Country Border.", imagePath: "/images/signs/information/country-border-sign-india.svg", signKey: "country_border" },
  { name: "Entry Ramp for Expressway", category: "Signs", meaning: "This sign indicates: Entry Ramp for Expressway.", rule: "You must follow the rule for: Entry Ramp for Expressway.", imagePath: "/images/signs/information/entry-ramp-for-expressway-sign-india.svg", signKey: "entry_ramp_for_expressway" },
  { name: "Exit Ramp for Expressway", category: "Signs", meaning: "This sign indicates: Exit Ramp for Expressway.", rule: "You must follow the rule for: Exit Ramp for Expressway.", imagePath: "/images/signs/information/exit-ramp-for-expressway-sign-india.svg", signKey: "exit_ramp_for_expressway" },
  { name: "End of Expressway", category: "Signs", meaning: "This sign indicates: End of Expressway.", rule: "You must follow the rule for: End of Expressway.", imagePath: "/images/signs/information/end-of-expressway-sign-india.svg", signKey: "end_of_expressway" },
  { name: "Bus Stop", category: "Signs", meaning: "This sign indicates: Bus Stop.", rule: "You must follow the rule for: Bus Stop.", imagePath: "/images/signs/information/bus-stop-sign-india.svg", signKey: "bus_stop" },
  { name: "Bus Lane", category: "Signs", meaning: "This sign indicates: Bus Lane.", rule: "You must follow the rule for: Bus Lane.", imagePath: "/images/signs/information/bus-lane-sign-india.svg", signKey: "bus_lane" },
  { name: "Contra Flow Bus Lane", category: "Signs", meaning: "This sign indicates: Contra Flow Bus Lane.", rule: "You must follow the rule for: Contra Flow Bus Lane.", imagePath: "/images/signs/information/contra-flow-bus-lane-sign-india.svg", signKey: "contra_flow_bus_lane" },
  { name: "Cycle Lane", category: "Signs", meaning: "This sign indicates: Cycle Lane.", rule: "You must follow the rule for: Cycle Lane.", imagePath: "/images/signs/information/cycle-lane-sign-india.svg", signKey: "cycle_lane" },
  { name: "Contra Flow Cycle Lane", category: "Signs", meaning: "This sign indicates: Contra Flow Cycle Lane.", rule: "You must follow the rule for: Contra Flow Cycle Lane.", imagePath: "/images/signs/information/contra-flow-cycle-lane-sign-india.svg", signKey: "contra_flow_cycle_lane" },
  { name: "Holiday Chalets", category: "Signs", meaning: "This sign indicates: Holiday Chalets.", rule: "You must follow the rule for: Holiday Chalets.", imagePath: "/images/signs/information/holiday-chalets-sign-india.svg", signKey: "holiday_chalets" },
  { name: "Emergency Exit (a)", category: "Signs", meaning: "This sign indicates: Emergency Exit (a).", rule: "You must follow the rule for: Emergency Exit (a).", imagePath: "/images/signs/information/emergency-exit-(a)-sign-india.svg", signKey: "emergency_exit__a_" },
  { name: "Emergency Exit (b)", category: "Signs", meaning: "This sign indicates: Emergency Exit (b).", rule: "You must follow the rule for: Emergency Exit (b).", imagePath: "/images/signs/information/emergency-exit-(b)-sign-india.svg", signKey: "emergency_exit__b_" },
  { name: "Emergency Helpline Number (a)", category: "Signs", meaning: "This sign indicates: Emergency Helpline Number (a).", rule: "You must follow the rule for: Emergency Helpline Number (a).", imagePath: "/images/signs/information/emergency-helpline-number-(a)-sign-india.svg", signKey: "emergency_helpline_number__a_" },
  { name: "Emergency Helpline Number (b)", category: "Signs", meaning: "This sign indicates: Emergency Helpline Number (b).", rule: "You must follow the rule for: Emergency Helpline Number (b).", imagePath: "/images/signs/information/emergency-helpline-number-(b)-sign-india.svg", signKey: "emergency_helpline_number__b_" },
  { name: "Emergency Lay-by", category: "Signs", meaning: "This sign indicates: Emergency Lay-by.", rule: "You must follow the rule for: Emergency Lay-by.", imagePath: "/images/signs/information/emergency-lay-by-sign-india.svg", signKey: "emergency_lay_by" },
  { name: "Fire Extinguisher", category: "Signs", meaning: "This sign indicates: Fire Extinguisher.", rule: "You must follow the rule for: Fire Extinguisher.", imagePath: "/images/signs/information/fire-extinguisher-sign-india.svg", signKey: "fire_extinguisher" },
  { name: "Rest and Service Area (a)", category: "Signs", meaning: "This sign indicates: Rest and Service Area (a).", rule: "You must follow the rule for: Rest and Service Area (a).", imagePath: "/images/signs/information/rest-and-service-area-(a)-sign-india.svg", signKey: "rest_and_service_area__a_" },
  { name: "Rest and Service Area (b)", category: "Signs", meaning: "This sign indicates: Rest and Service Area (b).", rule: "You must follow the rule for: Rest and Service Area (b).", imagePath: "/images/signs/information/rest-and-service-area-(b)-sign-india.svg", signKey: "rest_and_service_area__b_" },
  { name: "Electric Vehicle Charging Station", category: "Signs", meaning: "This sign indicates: Electric Vehicle Charging Station.", rule: "You must follow the rule for: Electric Vehicle Charging Station.", imagePath: "/images/signs/information/charging-station-sign-india.svg", signKey: "electric_vehicle_charging_station" },
  { name: "Auto Rickshaw Parking", category: "Parking", meaning: "This sign indicates: Auto Rickshaw Parking.", rule: "You must follow the rule for: Auto Rickshaw Parking.", imagePath: "/images/signs/information/auto-rickshaw-parking-sign-india.svg", signKey: "auto_rickshaw_parking" },
  { name: "Cycle Parking", category: "Parking", meaning: "This sign indicates: Cycle Parking.", rule: "You must follow the rule for: Cycle Parking.", imagePath: "/images/signs/information/cycle-parking-sign-india.svg", signKey: "cycle_parking" },
  { name: "Cycle Rickshaw Parking", category: "Parking", meaning: "This sign indicates: Cycle Rickshaw Parking.", rule: "You must follow the rule for: Cycle Rickshaw Parking.", imagePath: "/images/signs/information/cycle-rickshaw-parking-sign-india.svg", signKey: "cycle_rickshaw_parking" },
  { name: "Scooter and Motorcycle Parking", category: "Parking", meaning: "This sign indicates: Scooter and Motorcycle Parking.", rule: "You must follow the rule for: Scooter and Motorcycle Parking.", imagePath: "/images/signs/information/scooter-and-motorcycle-parking-sign-india.svg", signKey: "scooter_and_motorcycle_parking" },
  { name: "Taxi Parking", category: "Parking", meaning: "This sign indicates: Taxi Parking.", rule: "You must follow the rule for: Taxi Parking.", imagePath: "/images/signs/information/taxi-parking-sign-india.svg", signKey: "taxi_parking" },
  { name: "Car Parking", category: "Parking", meaning: "This sign indicates: Car Parking.", rule: "You must follow the rule for: Car Parking.", imagePath: "/images/signs/information/car-parking-sign-india.svg", signKey: "car_parking" },
  { name: "Park and Ride (By Metro)", category: "Parking", meaning: "This sign indicates: Park and Ride (By Metro).", rule: "You must follow the rule for: Park and Ride (By Metro).", imagePath: "/images/signs/information/park-and-ride-metro-india.svg", signKey: "park_and_ride__by_metro_" },
  { name: "Park and Ride (By Bus)", category: "Parking", meaning: "This sign indicates: Park and Ride (By Bus).", rule: "You must follow the rule for: Park and Ride (By Bus).", imagePath: "/images/signs/information/park-and-ride-bus-india.svg", signKey: "park_and_ride__by_bus_" },
  { name: "Pick Up & Drop Point", category: "Signs", meaning: "This sign indicates: Pick Up & Drop Point.", rule: "You must follow the rule for: Pick Up & Drop Point.", imagePath: "/images/signs/information/pick-up-and-drop-point-sign-india.svg", signKey: "pick_up___drop_point" },
  { name: "Flood Gauge", category: "Signs", meaning: "This sign indicates: Flood Gauge.", rule: "You must follow the rule for: Flood Gauge.", imagePath: "/images/signs/information/flood-gauge-india.svg", signKey: "flood_gauge" }
];

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: "q1",
    question: "Which side of the road must you keep to?",
    options: ["Left", "Right", "Center", "Whichever is clear"],
    correctIndex: 0,
    explanation: "The correct answer is 'Left'.",
    topic: "General Rules"
  },
  {
    id: "q2",
    question: "When overtaking, you should pass from?",
    options: ["Left", "Right", "Either side", "Above"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right'.",
    topic: "Overtaking"
  },
  {
    id: "q3",
    question: "At an uncontrolled intersection, who has right of way?",
    options: ["Vehicles from left", "Vehicles from right", "Bigger vehicles", "Faster vehicles"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicles from right'.",
    topic: "Intersections"
  },
  {
    id: "q4",
    question: "When an emergency vehicle approaches, you must:",
    options: ["Speed up", "Stop immediately", "Pull to the left and stop", "Ignore it"],
    correctIndex: 2,
    explanation: "The correct answer is 'Pull to the left and stop'.",
    topic: "Emergency"
  },
  {
    id: "q5",
    question: "U-turns are prohibited:",
    options: ["On empty roads", "Near hospitals", "On busy roads and curves", "In residential areas"],
    correctIndex: 2,
    explanation: "The correct answer is 'On busy roads and curves'.",
    topic: "Turning"
  },
  {
    id: "q6",
    question: "Pedestrians at a zebra crossing have:",
    options: ["No rights", "Right of way", "To wait for cars", "To run across"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right of way'.",
    topic: "Pedestrians"
  },
  {
    id: "q7",
    question: "When a vehicle approaches from behind to overtake:",
    options: ["Speed up", "Keep left and let it pass", "Block it", "Honk loudly"],
    correctIndex: 1,
    explanation: "The correct answer is 'Keep left and let it pass'.",
    topic: "Overtaking"
  },
  {
    id: "q8",
    question: "You are approaching a narrow bridge, another vehicle enters from opposite side:",
    options: ["Enter and force them back", "Wait till they clear the bridge", "Turn on headlights", "Honk and proceed"],
    correctIndex: 1,
    explanation: "The correct answer is 'Wait till they clear the bridge'.",
    topic: "Right of Way"
  },
  {
    id: "q9",
    question: "When entering a main road from a side road:",
    options: ["You have right of way", "Main road traffic has right of way", "Honk and enter", "Bigger vehicle goes first"],
    correctIndex: 1,
    explanation: "The correct answer is 'Main road traffic has right of way'.",
    topic: "Intersections"
  },
  {
    id: "q10",
    question: "If a vehicle is already in a roundabout:",
    options: ["You must give way to it", "It must give way to you", "Both must stop", "First to honk goes first"],
    correctIndex: 0,
    explanation: "The correct answer is 'You must give way to it'.",
    topic: "Roundabouts"
  },
  {
    id: "q11",
    question: "Before taking a right turn, you should:",
    options: ["Stay left", "Move to the center/right", "Speed up", "Turn off engine"],
    correctIndex: 1,
    explanation: "The correct answer is 'Move to the center/right'.",
    topic: "Turning"
  },
  {
    id: "q12",
    question: "When is overtaking prohibited?",
    options: ["When road ahead is not clearly visible", "At night", "On a highway", "When raining"],
    correctIndex: 0,
    explanation: "The correct answer is 'When road ahead is not clearly visible'.",
    topic: "Overtaking"
  },
  {
    id: "q13",
    question: "What is the rule for tailgating?",
    options: ["Maintain safe distance", "Stay bumper to bumper", "Flash lights constantly", "Drive zigzag"],
    correctIndex: 0,
    explanation: "The correct answer is 'Maintain safe distance'.",
    topic: "Safe Distance"
  },
  {
    id: "q14",
    question: "When driving on a hill, who has right of way?",
    options: ["Vehicle going downhill", "Vehicle going uphill", "Heavier vehicle", "Faster vehicle"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicle going uphill'.",
    topic: "Hills"
  },
  {
    id: "q15",
    question: "Overtaking is prohibited near:",
    options: ["A hospital", "A pedestrian crossing", "A police station", "A petrol pump"],
    correctIndex: 1,
    explanation: "The correct answer is 'A pedestrian crossing'.",
    topic: "Overtaking"
  },
  {
    id: "q16",
    question: "If you are being overtaken, you should not:",
    options: ["Increase your speed", "Decrease your speed", "Keep to the left", "Look in the mirror"],
    correctIndex: 0,
    explanation: "The correct answer is 'Increase your speed'.",
    topic: "Overtaking"
  },
  {
    id: "q17",
    question: "Reversing is prohibited on:",
    options: ["A one-way street", "A highway", "Both", "Neither"],
    correctIndex: 2,
    explanation: "The correct answer is 'Both'.",
    topic: "Reversing"
  },
  {
    id: "q18",
    question: "At a blind corner, you must:",
    options: ["Speed up to clear it", "Sound horn and slow down", "Turn off lights", "Overtake"],
    correctIndex: 1,
    explanation: "The correct answer is 'Sound horn and slow down'.",
    topic: "Turning"
  },
  {
    id: "q19",
    question: "When two roads cross without a signal:",
    options: ["Stop and wait", "Give way to traffic on your right", "Give way to traffic on your left", "Proceed without stopping"],
    correctIndex: 1,
    explanation: "The correct answer is 'Give way to traffic on your right'.",
    topic: "Intersections"
  },
  {
    id: "q20",
    question: "When an animal is on the road:",
    options: ["Sound horn loudly", "Flash lights", "Slow down or stop safely", "Steer around quickly"],
    correctIndex: 2,
    explanation: "The correct answer is 'Slow down or stop safely'.",
    topic: "Animals"
  },
  {
    id: "q21",
    question: "A red traffic light means:",
    options: ["Slow down", "Stop", "Proceed with caution", "Go"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop'.",
    topic: "Traffic Lights"
  },
  {
    id: "q22",
    question: "A flashing red traffic light means:",
    options: ["Stop and proceed when safe", "Slow down", "Traffic signal is broken", "Pedestrian crossing"],
    correctIndex: 0,
    explanation: "The correct answer is 'Stop and proceed when safe'.",
    topic: "Traffic Lights"
  },
  {
    id: "q23",
    question: "A flashing yellow traffic light means:",
    options: ["Stop", "Slow down and proceed with caution", "Speed up", "Signal broken"],
    correctIndex: 1,
    explanation: "The correct answer is 'Slow down and proceed with caution'.",
    topic: "Traffic Lights"
  },
  {
    id: "q24",
    question: "A green arrow with a red light means:",
    options: ["Stop for all directions", "Proceed only in direction of arrow", "Go straight", "Wait for green light"],
    correctIndex: 1,
    explanation: "The correct answer is 'Proceed only in direction of arrow'.",
    topic: "Traffic Lights"
  },
  {
    id: "q25",
    question: "Amber light appears after:",
    options: ["Red light", "Green light", "Flashing Red", "Flashing Amber"],
    correctIndex: 1,
    explanation: "The correct answer is 'Green light'.",
    topic: "Traffic Lights"
  },
  {
    id: "q26",
    question: "A solid continuous yellow line in the center means:",
    options: ["Overtaking allowed", "No overtaking/crossing", "Parking allowed", "One way"],
    correctIndex: 1,
    explanation: "The correct answer is 'No overtaking/crossing'.",
    topic: "Road Markings"
  },
  {
    id: "q27",
    question: "Broken white lines in the center mean:",
    options: ["Overtaking prohibited", "Overtaking allowed if safe", "Parking zone", "Pedestrian crossing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Overtaking allowed if safe'.",
    topic: "Road Markings"
  },
  {
    id: "q28",
    question: "Double solid yellow lines mean:",
    options: ["Strictly no passing", "Passing allowed", "Divided highway ends", "Lane merges"],
    correctIndex: 0,
    explanation: "The correct answer is 'Strictly no passing'.",
    topic: "Road Markings"
  },
  {
    id: "q29",
    question: "Stop line before an intersection is:",
    options: ["White", "Yellow", "Red", "Blue"],
    correctIndex: 0,
    explanation: "The correct answer is 'White'.",
    topic: "Road Markings"
  },
  {
    id: "q30",
    question: "Zebra crossing lines are:",
    options: ["Red and White", "Black and White", "Yellow and Black", "Blue and White"],
    correctIndex: 1,
    explanation: "The correct answer is 'Black and White'.",
    topic: "Road Markings"
  },
  {
    id: "q31",
    question: "Mandatory signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 1,
    explanation: "The correct answer is 'Circular'.",
    topic: "Road Signs"
  },
  {
    id: "q32",
    question: "Cautionary/Warning signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 0,
    explanation: "The correct answer is 'Triangular'.",
    topic: "Road Signs"
  },
  {
    id: "q33",
    question: "Informatory signs are usually:",
    options: ["Triangular", "Circular", "Rectangular", "Octagonal"],
    correctIndex: 2,
    explanation: "The correct answer is 'Rectangular'.",
    topic: "Road Signs"
  },
  {
    id: "q34",
    question: "A stop sign is shaped like an:",
    options: ["Octagon", "Triangle", "Circle", "Square"],
    correctIndex: 0,
    explanation: "The correct answer is 'Octagon'.",
    topic: "Road Signs"
  },
  {
    id: "q35",
    question: "Give Way sign is an:",
    options: ["Inverted triangle", "Upright triangle", "Circle", "Hexagon"],
    correctIndex: 0,
    explanation: "The correct answer is 'Inverted triangle'.",
    topic: "Road Signs"
  },
  {
    id: "q36",
    question: "Hand signal for stopping:",
    options: ["Right arm raised upward", "Right arm extended horizontally", "Left arm extended", "Waving hand"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm raised upward'.",
    topic: "Hand Signals"
  },
  {
    id: "q37",
    question: "Hand signal for turning right:",
    options: ["Right arm extended horizontally", "Right arm raised", "Left arm extended", "Waving hand"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm extended horizontally'.",
    topic: "Hand Signals"
  },
  {
    id: "q38",
    question: "Hand signal for turning left:",
    options: ["Right arm extended horizontally", "Right arm rotated anti-clockwise", "Left arm raised", "Both arms raised"],
    correctIndex: 1,
    explanation: "The correct answer is 'Right arm rotated anti-clockwise'.",
    topic: "Hand Signals"
  },
  {
    id: "q39",
    question: "Hand signal to allow overtaking:",
    options: ["Right arm swung forwards and backwards", "Right arm raised", "Left arm extended", "Flash headlights"],
    correctIndex: 0,
    explanation: "The correct answer is 'Right arm swung forwards and backwards'.",
    topic: "Hand Signals"
  },
  {
    id: "q40",
    question: "Using indicators instead of hand signals is:",
    options: ["Illegal", "Allowed and preferred", "Only for cars", "Only at night"],
    correctIndex: 1,
    explanation: "The correct answer is 'Allowed and preferred'.",
    topic: "Signals"
  },
  {
    id: "q41",
    question: "Speed limit near a school zone is usually:",
    options: ["25 km/h", "50 km/h", "80 km/h", "No limit"],
    correctIndex: 0,
    explanation: "The correct answer is '25 km/h'.",
    topic: "Speed Limits"
  },
  {
    id: "q42",
    question: "Driving above the speed limit is:",
    options: ["Allowed if road is empty", "An offence", "Allowed in emergencies", "Encouraged"],
    correctIndex: 1,
    explanation: "The correct answer is 'An offence'.",
    topic: "Speed Limits"
  },
  {
    id: "q43",
    question: "When driving in heavy rain, you should:",
    options: ["Increase speed", "Maintain speed", "Reduce speed and increase following distance", "Turn on hazard lights"],
    correctIndex: 2,
    explanation: "The correct answer is 'Reduce speed and increase following distance'.",
    topic: "Safe Driving"
  },
  {
    id: "q44",
    question: "What is the two-second rule?",
    options: ["Time to start engine", "Safe following distance", "Time to stop at red light", "Time to overtake"],
    correctIndex: 1,
    explanation: "The correct answer is 'Safe following distance'.",
    topic: "Safe Distance"
  },
  {
    id: "q45",
    question: "Parking is prohibited:",
    options: ["In a parking lot", "On a footpath", "In your garage", "On a side street"],
    correctIndex: 1,
    explanation: "The correct answer is 'On a footpath'.",
    topic: "Parking"
  },
  {
    id: "q46",
    question: "You should not park:",
    options: ["Near a fire hydrant", "In an open field", "In a designated zone", "In your driveway"],
    correctIndex: 0,
    explanation: "The correct answer is 'Near a fire hydrant'.",
    topic: "Parking"
  },
  {
    id: "q47",
    question: "Parking near a road intersection is:",
    options: ["Allowed", "Prohibited", "Allowed at night", "Allowed for 5 mins"],
    correctIndex: 1,
    explanation: "The correct answer is 'Prohibited'.",
    topic: "Parking"
  },
  {
    id: "q48",
    question: "Parking on a bridge is:",
    options: ["Allowed", "Prohibited", "Allowed if bridge is long", "Allowed for two-wheelers"],
    correctIndex: 1,
    explanation: "The correct answer is 'Prohibited'.",
    topic: "Parking"
  },
  {
    id: "q49",
    question: "When parking uphill with a curb, turn wheels:",
    options: ["Towards the curb", "Away from the curb", "Straight", "Doesn't matter"],
    correctIndex: 1,
    explanation: "The correct answer is 'Away from the curb'.",
    topic: "Parking"
  },
  {
    id: "q50",
    question: "When parking downhill, turn wheels:",
    options: ["Towards the curb", "Away from the curb", "Straight", "Parallel"],
    correctIndex: 0,
    explanation: "The correct answer is 'Towards the curb'.",
    topic: "Parking"
  },
  {
    id: "q51",
    question: "Leaving a vehicle in a dangerous position is:",
    options: ["A minor mistake", "A punishable offence", "Allowed if hazards are on", "Allowed for 10 mins"],
    correctIndex: 1,
    explanation: "The correct answer is 'A punishable offence'.",
    topic: "Parking"
  },
  {
    id: "q52",
    question: "Before opening your car door on the road:",
    options: ["Check mirrors and blind spots", "Open it quickly", "Honk", "Turn on interior light"],
    correctIndex: 0,
    explanation: "The correct answer is 'Check mirrors and blind spots'.",
    topic: "Safety"
  },
  {
    id: "q53",
    question: "Using a mobile phone while driving is:",
    options: ["Allowed if using speaker", "Allowed for texting", "Strictly prohibited", "Allowed in slow traffic"],
    correctIndex: 2,
    explanation: "The correct answer is 'Strictly prohibited'.",
    topic: "Safety"
  },
  {
    id: "q54",
    question: "Drinking and driving is:",
    options: ["Allowed up to 3 pegs", "Strictly prohibited", "Allowed at night", "Allowed if eating"],
    correctIndex: 1,
    explanation: "The correct answer is 'Strictly prohibited'.",
    topic: "Safety"
  },
  {
    id: "q55",
    question: "The permissible blood alcohol limit in India is:",
    options: ["30mg per 100ml", "50mg per 100ml", "80mg per 100ml", "Zero"],
    correctIndex: 0,
    explanation: "The correct answer is '30mg per 100ml'.",
    topic: "Laws"
  },
  {
    id: "q56",
    question: "If dazzled by oncoming headlights at night:",
    options: ["Look to the left side of the road", "Look directly at the lights", "Turn on high beam", "Close your eyes"],
    correctIndex: 0,
    explanation: "The correct answer is 'Look to the left side of the road'.",
    topic: "Night Driving"
  },
  {
    id: "q57",
    question: "When driving in fog, use:",
    options: ["High beam headlights", "Low beam headlights or fog lights", "Parking lights only", "No lights"],
    correctIndex: 1,
    explanation: "The correct answer is 'Low beam headlights or fog lights'.",
    topic: "Fog Driving"
  },
  {
    id: "q58",
    question: "Hazard warning lights should be used when:",
    options: ["Parked illegally", "Vehicle is stationary/broken down in a hazardous place", "Driving fast", "Towing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Vehicle is stationary/broken down in a hazardous place'.",
    topic: "Safety"
  },
  {
    id: "q59",
    question: "Free-wheeling (driving with clutch down or in neutral) is:",
    options: ["Good for fuel", "Dangerous as engine braking is lost", "Required on hills", "Recommended"],
    correctIndex: 1,
    explanation: "The correct answer is 'Dangerous as engine braking is lost'.",
    topic: "Safe Driving"
  },
  {
    id: "q60",
    question: "When a tyre bursts while driving:",
    options: ["Brake hard immediately", "Hold steering firmly and let vehicle slow down", "Accelerate", "Turn sharply"],
    correctIndex: 1,
    explanation: "The correct answer is 'Hold steering firmly and let vehicle slow down'.",
    topic: "Emergencies"
  },
  {
    id: "q61",
    question: "Which document is NOT mandatory to carry while driving?",
    options: ["Driving License", "Registration Certificate", "Passport", "Insurance Certificate"],
    correctIndex: 2,
    explanation: "The correct answer is 'Passport'.",
    topic: "Documents"
  },
  {
    id: "q62",
    question: "A learner's license is valid for:",
    options: ["1 month", "6 months", "1 year", "Lifetime"],
    correctIndex: 1,
    explanation: "The correct answer is '6 months'.",
    topic: "Licenses"
  },
  {
    id: "q63",
    question: "You can apply for a permanent license after:",
    options: ["10 days of Learner's License", "30 days of Learner's License", "3 months of Learner's License", "Immediately"],
    correctIndex: 1,
    explanation: "The correct answer is '30 days of Learner's License'.",
    topic: "Licenses"
  },
  {
    id: "q64",
    question: "Validity of PUC (Pollution Under Control) certificate for a new car is usually:",
    options: ["6 months", "1 year", "3 years", "5 years"],
    correctIndex: 1,
    explanation: "The correct answer is '1 year'.",
    topic: "Documents"
  },
  {
    id: "q65",
    question: "Minimum age to drive a transport (commercial) vehicle is:",
    options: ["18 years", "20 years", "21 years", "25 years"],
    correctIndex: 1,
    explanation: "The correct answer is '20 years'.",
    topic: "Licenses"
  },
  {
    id: "q66",
    question: "Minimum age to ride a 50cc gearless motorcycle is:",
    options: ["16 years", "18 years", "21 years", "14 years"],
    correctIndex: 0,
    explanation: "The correct answer is '16 years'.",
    topic: "Licenses"
  },
  {
    id: "q67",
    question: "Third-party insurance covers:",
    options: ["Damage to your own car", "Damage to the other person's property/life", "Theft of your car", "Engine failure"],
    correctIndex: 1,
    explanation: "The correct answer is 'Damage to the other person's property/life'.",
    topic: "Insurance"
  },
  {
    id: "q68",
    question: "Driving without insurance is:",
    options: ["Allowed for 1 month", "A punishable offence", "Allowed for two-wheelers", "Legal"],
    correctIndex: 1,
    explanation: "The correct answer is 'A punishable offence'.",
    topic: "Laws"
  },
  {
    id: "q69",
    question: "If involved in an accident causing injury, you must:",
    options: ["Flee the scene", "Take the victim to a hospital and report to police", "Call insurance only", "Move the vehicles immediately"],
    correctIndex: 1,
    explanation: "The correct answer is 'Take the victim to a hospital and report to police'.",
    topic: "Accidents"
  },
  {
    id: "q70",
    question: "Hit and run accidents involve:",
    options: ["Crashing into a tree", "Causing an accident and fleeing the scene", "Hitting an animal", "A small scratch"],
    correctIndex: 1,
    explanation: "The correct answer is 'Causing an accident and fleeing the scene'.",
    topic: "Accidents"
  },
  {
    id: "q71",
    question: "Number plates must be:",
    options: ["Written in any language", "Written in English/Arabic numerals", "Written in local language only", "Hand painted"],
    correctIndex: 1,
    explanation: "The correct answer is 'Written in English/Arabic numerals'.",
    topic: "Rules"
  },
  {
    id: "q72",
    question: "Using a vehicle without a registration mark is:",
    options: ["Illegal", "Allowed for 7 days", "Allowed if new", "Allowed for politicians"],
    correctIndex: 0,
    explanation: "The correct answer is 'Illegal'.",
    topic: "Rules"
  },
  {
    id: "q73",
    question: "Tinted glass on vehicles:",
    options: ["Must allow 100% visibility", "Must comply with visual transmission standards", "Is completely banned", "Is fully allowed"],
    correctIndex: 1,
    explanation: "The correct answer is 'Must comply with visual transmission standards'.",
    topic: "Rules"
  },
  {
    id: "q74",
    question: "Seatbelts are mandatory for:",
    options: ["Driver only", "Front passengers only", "Driver and all passengers", "Children only"],
    correctIndex: 2,
    explanation: "The correct answer is 'Driver and all passengers'.",
    topic: "Safety"
  },
  {
    id: "q75",
    question: "Wearing a helmet is mandatory for:",
    options: ["Rider only", "Pillion rider only", "Both rider and pillion", "Women are exempted everywhere"],
    correctIndex: 2,
    explanation: "The correct answer is 'Both rider and pillion'.",
    topic: "Safety"
  },
  {
    id: "q76",
    question: "A police officer in uniform asks for your documents:",
    options: ["You must produce them", "You can refuse", "You can show them later", "You must run"],
    correctIndex: 0,
    explanation: "The correct answer is 'You must produce them'.",
    topic: "Laws"
  },
  {
    id: "q77",
    question: "If your license is suspended:",
    options: ["You can drive in another state", "You cannot drive any vehicle", "You can drive two-wheelers", "You can drive with an 'L' board"],
    correctIndex: 1,
    explanation: "The correct answer is 'You cannot drive any vehicle'.",
    topic: "Laws"
  },
  {
    id: "q78",
    question: "An 'L' board must be displayed:",
    options: ["By all drivers", "By learner license holders", "By heavy vehicles", "By ladies"],
    correctIndex: 1,
    explanation: "The correct answer is 'By learner license holders'.",
    topic: "Rules"
  },
  {
    id: "q79",
    question: "The color of an 'L' board is:",
    options: ["Red letter on white background", "Black letter on yellow background", "White letter on red background", "Red letter on yellow background"],
    correctIndex: 0,
    explanation: "The correct answer is 'Red letter on white background'.",
    topic: "Rules"
  },
  {
    id: "q80",
    question: "Carrying more passengers than the permitted seating capacity is:",
    options: ["Allowed in rural areas", "An offence", "Allowed for short distances", "Allowed if they are children"],
    correctIndex: 1,
    explanation: "The correct answer is 'An offence'.",
    topic: "Rules"
  },
  {
    id: "q81",
    question: "When an ambulance is approaching:",
    options: ["Do not yield", "Yield right of way by moving left", "Follow it closely", "Race it"],
    correctIndex: 1,
    explanation: "The correct answer is 'Yield right of way by moving left'.",
    topic: "Emergency"
  },
  {
    id: "q82",
    question: "You should not sound your horn:",
    options: ["To warn of danger", "At a blind corner", "Near a hospital", "During the day"],
    correctIndex: 2,
    explanation: "The correct answer is 'Near a hospital'.",
    topic: "Rules"
  },
  {
    id: "q83",
    question: "If a blind person with a white cane is crossing:",
    options: ["Honk to warn them", "Bypass them quickly", "Stop and wait for them to cross", "Shout at them"],
    correctIndex: 2,
    explanation: "The correct answer is 'Stop and wait for them to cross'.",
    topic: "Pedestrians"
  },
  {
    id: "q84",
    question: "When you see a 'Stop' sign, you must:",
    options: ["Slow down", "Stop completely before the line", "Stop only if traffic is coming", "Honk and go"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop completely before the line'.",
    topic: "Signs"
  },
  {
    id: "q85",
    question: "If you meet a procession on the road:",
    options: ["Drive through it", "Sound horn continuously", "Wait for it to pass or take another route", "Overtake them quickly"],
    correctIndex: 2,
    explanation: "The correct answer is 'Wait for it to pass or take another route'.",
    topic: "Rules"
  },
  {
    id: "q86",
    question: "Overtaking is prohibited on:",
    options: ["A straight road", "A bridge or narrow road", "A multi-lane highway", "A one-way street"],
    correctIndex: 1,
    explanation: "The correct answer is 'A bridge or narrow road'.",
    topic: "Overtaking"
  },
  {
    id: "q87",
    question: "The term 'Blind Spot' refers to:",
    options: ["Areas not visible in the mirrors", "Driving at night", "Foggy weather", "Tinted windows"],
    correctIndex: 0,
    explanation: "The correct answer is 'Areas not visible in the mirrors'.",
    topic: "Safety"
  },
  {
    id: "q88",
    question: "To check blind spots, you must:",
    options: ["Look in the rearview mirror", "Look in the side mirrors", "Turn your head and look over your shoulder", "Use a reverse camera"],
    correctIndex: 2,
    explanation: "The correct answer is 'Turn your head and look over your shoulder'.",
    topic: "Safety"
  },
  {
    id: "q89",
    question: "Before starting a vehicle, you should:",
    options: ["Rev the engine", "Check mirrors, seat, and seatbelt", "Turn on the radio", "Sound the horn"],
    correctIndex: 1,
    explanation: "The correct answer is 'Check mirrors, seat, and seatbelt'.",
    topic: "Safety"
  },
  {
    id: "q90",
    question: "Aquaplaning or hydroplaning occurs when:",
    options: ["Tyres lose contact with the road due to water", "Driving in snow", "Engine overheats", "Brakes fail"],
    correctIndex: 0,
    explanation: "The correct answer is 'Tyres lose contact with the road due to water'.",
    topic: "Driving Conditions"
  },
  {
    id: "q91",
    question: "When driving down a steep hill, you should:",
    options: ["Put the car in neutral", "Turn off the engine", "Use a lower gear", "Use only the handbrake"],
    correctIndex: 2,
    explanation: "The correct answer is 'Use a lower gear'.",
    topic: "Hills"
  },
  {
    id: "q92",
    question: "What is engine braking?",
    options: ["Using brakes to stop engine", "Using lower gears to slow the vehicle", "Engine failure", "Braking suddenly"],
    correctIndex: 1,
    explanation: "The correct answer is 'Using lower gears to slow the vehicle'.",
    topic: "Driving Tech"
  },
  {
    id: "q93",
    question: "If your brakes fail, you should NOT:",
    options: ["Pump the brake pedal", "Use the handbrake carefully", "Turn off the ignition immediately", "Shift to a lower gear"],
    correctIndex: 2,
    explanation: "The correct answer is 'Turn off the ignition immediately'.",
    topic: "Emergencies"
  },
  {
    id: "q94",
    question: "When towing another vehicle, the maximum speed is usually:",
    options: ["25 km/h", "50 km/h", "80 km/h", "No limit"],
    correctIndex: 0,
    explanation: "The correct answer is '25 km/h'.",
    topic: "Towing"
  },
  {
    id: "q95",
    question: "The distance between the towing vehicle and towed vehicle should not exceed:",
    options: ["5 meters", "10 meters", "15 meters", "20 meters"],
    correctIndex: 0,
    explanation: "The correct answer is '5 meters'.",
    topic: "Towing"
  },
  {
    id: "q96",
    question: "A vehicle with a red flashing beacon indicates:",
    options: ["A VIP", "An emergency/police/fire vehicle", "A slow moving vehicle", "A broken down vehicle"],
    correctIndex: 1,
    explanation: "The correct answer is 'An emergency/police/fire vehicle'.",
    topic: "Vehicles"
  },
  {
    id: "q97",
    question: "A yellow flashing beacon indicates:",
    options: ["Police", "Ambulance", "A construction or maintenance vehicle", "Fire engine"],
    correctIndex: 2,
    explanation: "The correct answer is 'A construction or maintenance vehicle'.",
    topic: "Vehicles"
  },
  {
    id: "q98",
    question: "If you feel drowsy while driving:",
    options: ["Drink coffee and continue", "Open windows", "Stop safely and take a rest", "Turn up the radio"],
    correctIndex: 2,
    explanation: "The correct answer is 'Stop safely and take a rest'.",
    topic: "Safety"
  },
  {
    id: "q99",
    question: "Driver's reaction time is affected by:",
    options: ["Good weather", "Alcohol, drugs, and fatigue", "Wearing seatbelts", "Listening to music"],
    correctIndex: 1,
    explanation: "The correct answer is 'Alcohol, drugs, and fatigue'.",
    topic: "Safety"
  },
  {
    id: "q100",
    question: "Exhaust noise should be controlled by:",
    options: ["Using a loud horn", "A proper silencer", "Driving slowly", "Turning off engine at signals"],
    correctIndex: 1,
    explanation: "The correct answer is 'A proper silencer'.",
    topic: "Pollution"
  },
  {
    id: "q101",
    question: "When approaching a railway crossing without barriers:",
    options: ["Cross quickly", "Stop, look both ways, and cross if safe", "Sound horn and cross", "Follow the car ahead closely"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop, look both ways, and cross if safe'.",
    topic: "Railways"
  },
  {
    id: "q102",
    question: "If a vehicle stalls on a railway crossing:",
    options: ["Leave it and run", "Try to push it clear or warn trains", "Sit inside and call police", "Lock it"],
    correctIndex: 1,
    explanation: "The correct answer is 'Try to push it clear or warn trains'.",
    topic: "Emergencies"
  },
  {
    id: "q103",
    question: "You should dim your headlights at night when:",
    options: ["Driving in a city with streetlights", "Following a vehicle or facing oncoming traffic", "It rains", "Driving on a highway"],
    correctIndex: 1,
    explanation: "The correct answer is 'Following a vehicle or facing oncoming traffic'.",
    topic: "Night Driving"
  },
  {
    id: "q104",
    question: "High beam headlights should be used:",
    options: ["In fog", "On unlit roads with no oncoming traffic", "In heavy traffic", "During the day"],
    correctIndex: 1,
    explanation: "The correct answer is 'On unlit roads with no oncoming traffic'.",
    topic: "Night Driving"
  },
  {
    id: "q105",
    question: "A 'No Entry' sign means:",
    options: ["You can enter if empty", "All vehicles are prohibited from entering", "Only heavy vehicles prohibited", "Entry allowed for locals"],
    correctIndex: 1,
    explanation: "The correct answer is 'All vehicles are prohibited from entering'.",
    topic: "Signs"
  },
  {
    id: "q106",
    question: "A 'One Way' sign means:",
    options: ["Traffic flows in both directions", "You must not reverse", "Traffic flows in one direction only", "Only one car at a time"],
    correctIndex: 2,
    explanation: "The correct answer is 'Traffic flows in one direction only'.",
    topic: "Signs"
  },
  {
    id: "q107",
    question: "A 'No Parking' sign means:",
    options: ["You can stop to drop passengers", "You cannot stop at all", "You can park for 5 minutes", "You can park two-wheelers"],
    correctIndex: 0,
    explanation: "The correct answer is 'You can stop to drop passengers'.",
    topic: "Signs"
  },
  {
    id: "q108",
    question: "A 'No Stopping or Standing' sign means:",
    options: ["You can drop passengers", "You cannot halt your vehicle at all", "You can wait inside the car", "You can park"],
    correctIndex: 1,
    explanation: "The correct answer is 'You cannot halt your vehicle at all'.",
    topic: "Signs"
  },
  {
    id: "q109",
    question: "A 'Compulsory Turn Left' sign means:",
    options: ["You may go straight", "You must turn left", "Left turn is prohibited", "Left turn is optional"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must turn left'.",
    topic: "Signs"
  },
  {
    id: "q110",
    question: "A 'Yield' or 'Give Way' sign means:",
    options: ["You have right of way", "Stop completely", "Give way to traffic on the intersecting road", "Speed up"],
    correctIndex: 2,
    explanation: "The correct answer is 'Give way to traffic on the intersecting road'.",
    topic: "Signs"
  },
  {
    id: "q111",
    question: "A rectangular blue sign with a 'P' and a car indicates:",
    options: ["No parking for cars", "Parking for cars only", "Petrol pump", "Police station"],
    correctIndex: 1,
    explanation: "The correct answer is 'Parking for cars only'.",
    topic: "Signs"
  },
  {
    id: "q112",
    question: "A blue circular sign with a white bicycle means:",
    options: ["No bicycles", "Compulsory cycle track", "Bicycle shop", "Beware of bicycles"],
    correctIndex: 1,
    explanation: "The correct answer is 'Compulsory cycle track'.",
    topic: "Signs"
  },
  {
    id: "q113",
    question: "If you hit an unattended parked car, you must:",
    options: ["Drive away", "Leave a note with your contact details", "Wait 5 minutes then leave", "Sound horn"],
    correctIndex: 1,
    explanation: "The correct answer is 'Leave a note with your contact details'.",
    topic: "Accidents"
  },
  {
    id: "q114",
    question: "What should you do if your accelerator pedal gets stuck?",
    options: ["Turn off ignition immediately", "Shift to neutral and brake safely", "Pull the handbrake hard", "Jump out"],
    correctIndex: 1,
    explanation: "The correct answer is 'Shift to neutral and brake safely'.",
    topic: "Emergencies"
  },
  {
    id: "q115",
    question: "What is the safe way to negotiate a curve?",
    options: ["Brake hard inside the curve", "Slow down before the curve, accelerate smoothly out", "Coast in neutral", "Overtake in the curve"],
    correctIndex: 1,
    explanation: "The correct answer is 'Slow down before the curve, accelerate smoothly out'.",
    topic: "Driving Tech"
  },
  {
    id: "q116",
    question: "To stop a skidding vehicle without ABS:",
    options: ["Slam the brakes", "Pump the brakes and steer in direction of skid", "Accelerate", "Turn the steering sharply"],
    correctIndex: 1,
    explanation: "The correct answer is 'Pump the brakes and steer in direction of skid'.",
    topic: "Emergencies"
  },
  {
    id: "q117",
    question: "When approaching a roundabout, you should:",
    options: ["Indicate left to enter", "Indicate right to enter", "Give way to traffic already on it", "Drive straight through"],
    correctIndex: 2,
    explanation: "The correct answer is 'Give way to traffic already on it'.",
    topic: "Roundabouts"
  },
  {
    id: "q118",
    question: "A driver approaching a T-intersection must:",
    options: ["Give way to through traffic", "Have right of way", "Honk and proceed", "Stop and turn off engine"],
    correctIndex: 0,
    explanation: "The correct answer is 'Give way to through traffic'.",
    topic: "Intersections"
  },
  {
    id: "q119",
    question: "If you miss your exit on a highway:",
    options: ["Reverse on the highway", "Make a U-turn in the median", "Continue to the next exit", "Stop and wait"],
    correctIndex: 2,
    explanation: "The correct answer is 'Continue to the next exit'.",
    topic: "Highways"
  },
  {
    id: "q120",
    question: "When driving behind a heavy truck, you should:",
    options: ["Stay very close to avoid wind resistance", "Stay far back to have a clear view ahead", "Overtake from the left", "Honk continuously"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stay far back to have a clear view ahead'.",
    topic: "Safe Distance"
  },
  {
    id: "q121",
    question: "The recommended grip on the steering wheel is:",
    options: ["10 and 2 o'clock or 9 and 3 o'clock", "One hand at 12 o'clock", "Underhand grip", "One hand out the window"],
    correctIndex: 0,
    explanation: "The correct answer is '10 and 2 o'clock or 9 and 3 o'clock'.",
    topic: "Safety"
  },
  {
    id: "q122",
    question: "In a manual car, riding the clutch means:",
    options: ["Keeping foot lightly on the clutch pedal while driving", "Fully pressing the clutch", "Changing gears smoothly", "Using clutch to brake"],
    correctIndex: 0,
    explanation: "The correct answer is 'Keeping foot lightly on the clutch pedal while driving'.",
    topic: "Driving Tech"
  },
  {
    id: "q123",
    question: "Riding the clutch causes:",
    options: ["Better fuel economy", "Premature wear of the clutch plates", "Smoother ride", "Engine overheating"],
    correctIndex: 1,
    explanation: "The correct answer is 'Premature wear of the clutch plates'.",
    topic: "Maintenance"
  },
  {
    id: "q124",
    question: "What should be checked regularly for tyre safety?",
    options: ["Air pressure and tread depth", "Color of the tyre", "Brand of the tyre", "Wheel covers"],
    correctIndex: 0,
    explanation: "The correct answer is 'Air pressure and tread depth'.",
    topic: "Maintenance"
  },
  {
    id: "q125",
    question: "Low tyre pressure causes:",
    options: ["Better handling", "Poor fuel economy and unstable handling", "Higher top speed", "Nothing"],
    correctIndex: 1,
    explanation: "The correct answer is 'Poor fuel economy and unstable handling'.",
    topic: "Maintenance"
  },
  {
    id: "q126",
    question: "What does a flashing pedestrian crossing light indicate?",
    options: ["Pedestrians must run", "Drivers must stop and yield if a pedestrian is crossing", "Drivers can speed up", "Traffic signal is broken"],
    correctIndex: 1,
    explanation: "The correct answer is 'Drivers must stop and yield if a pedestrian is crossing'.",
    topic: "Pedestrians"
  },
  {
    id: "q127",
    question: "Which lane is generally used for overtaking on a multi-lane highway?",
    options: ["The left-most lane", "The extreme right lane", "The center lane", "The shoulder"],
    correctIndex: 1,
    explanation: "The correct answer is 'The extreme right lane'.",
    topic: "Highways"
  },
  {
    id: "q128",
    question: "Zig-zag lines on the road mean:",
    options: ["Parking is allowed", "Overtaking and parking are strictly prohibited", "Pedestrian crossing ahead", "Bus stop"],
    correctIndex: 1,
    explanation: "The correct answer is 'Overtaking and parking are strictly prohibited'.",
    topic: "Road Markings"
  },
  {
    id: "q129",
    question: "A yellow box junction indicates:",
    options: ["You can park inside", "You must not enter unless your exit is clear", "You have right of way", "You must stop inside it"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must not enter unless your exit is clear'.",
    topic: "Intersections"
  },
  {
    id: "q130",
    question: "When a police officer signals you to stop at a green light:",
    options: ["Follow the traffic light", "Obey the police officer", "Honk at the officer", "Ignore both"],
    correctIndex: 1,
    explanation: "The correct answer is 'Obey the police officer'.",
    topic: "Signals"
  },
  {
    id: "q131",
    question: "What is the validity of a transport vehicle driving license?",
    options: ["20 years", "5 years", "1 year", "3 years"],
    correctIndex: 1,
    explanation: "The correct answer is '5 years'.",
    topic: "Licenses"
  },
  {
    id: "q132",
    question: "Grace period for renewing an expired driving license without penalty is:",
    options: ["30 days", "15 days", "6 months", "1 year"],
    correctIndex: 0,
    explanation: "The correct answer is '30 days'.",
    topic: "Licenses"
  },
  {
    id: "q133",
    question: "If you modify your vehicle's engine or chassis:",
    options: ["No action is needed", "You must get it approved by the RTO", "You must inform the police", "You must paint it red"],
    correctIndex: 1,
    explanation: "The correct answer is 'You must get it approved by the RTO'.",
    topic: "Rules"
  },
  {
    id: "q134",
    question: "A private vehicle's registration plate has:",
    options: ["Yellow background, black letters", "White background, black letters", "Black background, yellow letters", "Green background, white letters"],
    correctIndex: 1,
    explanation: "The correct answer is 'White background, black letters'.",
    topic: "Rules"
  },
  {
    id: "q135",
    question: "A commercial vehicle's registration plate has:",
    options: ["White background, black letters", "Yellow background, black letters", "Black background, yellow letters", "Red background, white letters"],
    correctIndex: 1,
    explanation: "The correct answer is 'Yellow background, black letters'.",
    topic: "Rules"
  },
  {
    id: "q136",
    question: "An electric vehicle's registration plate has:",
    options: ["Green background", "White background", "Yellow background", "Blue background"],
    correctIndex: 0,
    explanation: "The correct answer is 'Green background'.",
    topic: "Rules"
  },
  {
    id: "q137",
    question: "Foreign diplomatic vehicles have plates with:",
    options: ["Red background", "Light blue background", "White background", "Green background"],
    correctIndex: 1,
    explanation: "The correct answer is 'Light blue background'.",
    topic: "Rules"
  },
  {
    id: "q138",
    question: "If your vehicle is stolen, the first step is:",
    options: ["Inform insurance company", "File an FIR with the police", "Buy a new car", "Inform RTO"],
    correctIndex: 1,
    explanation: "The correct answer is 'File an FIR with the police'.",
    topic: "Emergencies"
  },
  {
    id: "q139",
    question: "PUC stands for:",
    options: ["Public Under Control", "Pollution Under Control", "Passenger Utility Car", "Private Utility Certificate"],
    correctIndex: 1,
    explanation: "The correct answer is 'Pollution Under Control'.",
    topic: "Documents"
  },
  {
    id: "q140",
    question: "Using a mobile phone for navigation is:",
    options: ["Illegal", "Allowed if securely mounted and doesn't distract", "Allowed holding in one hand", "Allowed only for trucks"],
    correctIndex: 1,
    explanation: "The correct answer is 'Allowed if securely mounted and doesn't distract'.",
    topic: "Safety"
  },
  {
    id: "q141",
    question: "Loud music inside the car is:",
    options: ["Recommended", "Dangerous as it masks outside warning sounds", "Allowed on highways", "A requirement"],
    correctIndex: 1,
    explanation: "The correct answer is 'Dangerous as it masks outside warning sounds'.",
    topic: "Safety"
  },
  {
    id: "q142",
    question: "During a traffic jam, you should:",
    options: ["Switch off the engine to reduce pollution", "Honk continuously", "Try to squeeze between lanes", "Drive on the footpath"],
    correctIndex: 0,
    explanation: "The correct answer is 'Switch off the engine to reduce pollution'.",
    topic: "Environment"
  },
  {
    id: "q143",
    question: "To save fuel, you should:",
    options: ["Drive in lower gears", "Accelerate and brake abruptly", "Maintain steady speed in highest possible gear", "Keep engine idling"],
    correctIndex: 2,
    explanation: "The correct answer is 'Maintain steady speed in highest possible gear'.",
    topic: "Environment"
  },
  {
    id: "q144",
    question: "A catalytic converter is used to:",
    options: ["Reduce noise", "Increase speed", "Reduce toxic emissions", "Cool the engine"],
    correctIndex: 2,
    explanation: "The correct answer is 'Reduce toxic emissions'.",
    topic: "Environment"
  },
  {
    id: "q145",
    question: "The term 'Engine Braking' is most useful:",
    options: ["On flat roads", "When driving downhill", "When parking", "When starting"],
    correctIndex: 1,
    explanation: "The correct answer is 'When driving downhill'.",
    topic: "Driving Tech"
  },
  {
    id: "q146",
    question: "Airbags are designed to work in conjunction with:",
    options: ["Anti-lock brakes", "Seatbelts", "Power steering", "Headrests"],
    correctIndex: 1,
    explanation: "The correct answer is 'Seatbelts'.",
    topic: "Safety"
  },
  {
    id: "q147",
    question: "When driving past parked cars, beware of:",
    options: ["People opening doors", "Cars pulling out", "Children stepping out", "All of the above"],
    correctIndex: 3,
    explanation: "The correct answer is 'All of the above'.",
    topic: "Safety"
  },
  {
    id: "q148",
    question: "A 'School Zone' sign indicates:",
    options: ["Children playing on road", "School ahead, drive slowly", "School bus stop", "No entry for cars"],
    correctIndex: 1,
    explanation: "The correct answer is 'School ahead, drive slowly'.",
    topic: "Signs"
  },
  {
    id: "q149",
    question: "If a school bus is stopped with flashing lights:",
    options: ["Overtake quickly", "Stop and wait for children to board/alight", "Sound horn", "Drive on the opposite side"],
    correctIndex: 1,
    explanation: "The correct answer is 'Stop and wait for children to board/alight'.",
    topic: "Safety"
  },
  {
    id: "q150",
    question: "The minimum age for obtaining a permanent license for a car is:",
    options: ["16 years", "18 years", "20 years", "21 years"],
    correctIndex: 1,
    explanation: "The correct answer is '18 years'.",
    topic: "Licenses"
  },
];
