-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 23, 2021 at 05:41 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `events`
--

-- --------------------------------------------------------

--
-- Table structure for table `eventslist`
--

CREATE TABLE `eventslist` (
  `id` int(11) NOT NULL,
  `event_name` text NOT NULL,
  `event_start_date` date NOT NULL,
  `event_end_date` date NOT NULL,
  `event_start_hour` int(11) NOT NULL,
  `event_end_hour` int(11) NOT NULL,
  `event_time_string` varchar(100) NOT NULL,
  `event_type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `eventslist`
--

INSERT INTO `eventslist` (`id`, `event_name`, `event_start_date`, `event_end_date`, `event_start_hour`, `event_end_hour`, `event_time_string`, `event_type`) VALUES
(1, 'Birthday', '2021-01-23', '2021-01-23', 0, 1, '00:30 am to 01:30 am', 'Daily'),
(2, 'Meeting', '2021-01-23', '2021-01-23', 1, 12, '01:01 am to 12:30 pm', 'Daily'),
(3, 'Fun', '2021-01-23', '2021-01-28', 1, 2, '01:01 am to 02:30 am', 'Weekly'),
(4, 'Picnic', '2021-01-30', '2021-01-30', 23, 0, '11:01 pm to 00:30 am', 'Daily'),
(5, 'Month Meeting', '2020-12-23', '2021-01-23', 1, 2, '01:01 am to 02:30 am', 'Monthly');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eventslist`
--
ALTER TABLE `eventslist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `eventslist`
--
ALTER TABLE `eventslist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
